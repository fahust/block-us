import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { InvestEntity } from './invest.entity';
import { UserEntity } from 'src/user/user.entity';
import { ProjectService } from 'src/project/project.service';
import dataSource from 'db/data-source';
import { TransactionReceipt } from 'ethers';
import { HelperBlockchainService } from 'src/helper/service/helper.blockchain.service';
import { ConfigService } from '@nestjs/config';
import { NotificationEntity } from 'src/notification/notification.entity';

@Injectable()
export class InvestService {
  private alchemyKey: string;
  constructor(
    @InjectRepository(InvestEntity)
    private investRepository: Repository<InvestEntity>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
    private helperBlockchainService: HelperBlockchainService,
    private configService: ConfigService,
  ) {
    this.alchemyKey = this.configService.get('ALCHEMY_KEY');
  }

  async get(id: number): Promise<InvestEntity> {
    return this.investRepository
      .createQueryBuilder('invest')
      .where('invest.id = :id', { id })
      .select([
        'invest.id',
        'invest.hash',
        'invest.value',
        'invest.chainId',
        'invest.created_at',
      ])
      .getOne();
  }

  async create(
    owner: UserEntity,
    invest: InvestEntity,
    projectId: number,
  ): Promise<InvestEntity> {
    const project = await this.projectService.get(projectId);
    return this.save({
      ...invest,
      owner,
      project,
    });
  }

  async myInvests(
    ownerId: number,
    take: number,
    skip: number,
  ): Promise<InvestEntity[]> {
    return this.investRepository
      .createQueryBuilder('invest')
      .leftJoin('invest.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
      .select([
        'invest.id',
        'invest.hash',
        'invest.value',
        'invest.chainId',
        'invest.created_at',
      ])
      .take(take)
      .skip(skip)
      .getMany();
  }

  async investsOfProject(
    projectId: number,
    take: number,
    skip: number,
  ): Promise<InvestEntity[]> {
    return this.investRepository
      .createQueryBuilder('invest')
      .leftJoin('invest.project', 'project')
      .where('project.id = :projectId', { projectId })
      .andWhere('invest.validation = :validation', { validation: true })
      .select([
        'invest.id',
        'invest.hash',
        'invest.chainId',
        'invest.created_at',
        'project.walletAddressProxy',
      ])
      .take(take)
      .skip(skip)
      .getMany();
  }

  async investsValueOfProject(projectId: number): Promise<number> {
    const invests = await this.investsOfProject(projectId, 0, 0);

    return invests.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    );
  }

  async save(invest: InvestEntity): Promise<InvestEntity> {
    try {
      return this.investRepository.save(invest);
    } catch (error) {
      throw new HttpException(
        JSON.stringify(error?.driverError?.detail),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkValidationTx() {
    const invests = await this.investRepository
      .createQueryBuilder('invest')
      .leftJoin('invest.project', 'project')
      .leftJoin('project.owner', 'projectOwner')
      .leftJoin('project.invests', 'projectInvests')
      .leftJoin('projectInvests.owner', 'projectInvestsOwner')
      .where('invest.validation = :validation', { validation: false })
      .select([
        'invest.id',
        'invest.hash',
        'invest.value',
        'invest.chainId',
        'invest.created_at',
        'project.walletAddressProxy',
        'project.title',
        'projectOwner.id',
        'projectInvests.id',
        'projectInvestsOwner.id',
      ])
      .getMany();

    if (invests.length) {
      if (!dataSource.isInitialized) await dataSource.initialize();
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        for (const invest of invests) {
          let tx: TransactionReceipt;
          try {
            tx = await this.helperBlockchainService.getStatusTransaction(
              this.alchemyKey,
              invest.hash,
              invest.chainId,
            );
          } catch (error) {
            console.log(error);
          }

          if (
            !tx ||
            tx.to !== invest.project.walletAddressProxy ||
            Date.now() > invest.created_at.getTime() + 86400000
          ) {
            await queryRunner.manager.delete(InvestEntity, invest.id);
          } else if (tx?.status === 1 && tx?.status === 1) {
            await this.sendNotification(invest, queryRunner);
            await queryRunner.manager.save(InvestEntity, {
              ...invest,
              validation: true,
            });
          }
        }

        await queryRunner.commitTransaction();
      } catch (err) {
        console.log(err);
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
  }

  private async sendNotification(
    invest: InvestEntity,
    queryRunner: QueryRunner,
  ) {
    const uniqueInvestors = invest.project.invests?.filter(
      (i1, index) =>
        invest.project.invests.findIndex(
          (i2: InvestEntity) => i1?.owner.id === i2?.owner.id,
        ) === index,
    );

    for (const investor of uniqueInvestors) {
      const notification = new NotificationEntity();
      notification.owner = investor.owner;
      notification.project = invest.project;
      notification.content = `New investment of ${invest.value} wei for project ${invest.project.title}`;
      await queryRunner.manager.save(NotificationEntity, notification);
    }

    const notification = new NotificationEntity();
    notification.owner = invest.project.owner;
    notification.project = invest.project;
    notification.content = `New investment of ${invest.value} wei for your project ${invest.project.title}`;
    await queryRunner.manager.save(NotificationEntity, notification);
  }
}
