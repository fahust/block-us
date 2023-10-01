import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestEntity } from './invest.entity';
import { UserEntity } from 'src/user/user.entity';
import { ProjectService } from 'src/project/project.service';
import dataSource from 'db/data-source';
import { TransactionReceipt } from 'ethers';
import { HelperBlockchainService } from 'src/helper/service/helper.blockchain.service';
import { ConfigService } from '@nestjs/config';

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
    return await this.investRepository
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
      return await this.investRepository.save(invest);
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
      .where('invest.validation = :validation', { validation: false })
      .select([
        'invest.id',
        'invest.hash',
        'invest.chainId',
        'invest.created_at',
        'project.walletAddressProxy',
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
}
