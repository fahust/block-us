import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReclaimEntity } from './reclaim.entity';
import { UserEntity } from 'src/user/user.entity';
import { ProjectService } from 'src/project/project.service';
import dataSource from 'db/data-source';
import { TransactionReceipt } from 'ethers';
import { HelperBlockchainService } from 'src/helper/service/helper.blockchain.service';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ReclaimService {
  private alchemyKey: string;
  constructor(
    @InjectRepository(ReclaimEntity)
    private reclaimRepository: Repository<ReclaimEntity>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
    private helperBlockchainService: HelperBlockchainService,
    private notificationService: NotificationService,
    private configService: ConfigService,
  ) {
    this.alchemyKey = this.configService.get('ALCHEMY_KEY');
  }

  async get(id: number): Promise<ReclaimEntity> {
    return this.reclaimRepository
      .createQueryBuilder('reclaim')
      .where('reclaim.id = :id', { id })
      .select([
        'reclaim.id',
        'reclaim.hash',
        'reclaim.value',
        'reclaim.chainId',
        'reclaim.created_at',
      ])
      .getOne();
  }

  async create(
    owner: UserEntity,
    reclaim: ReclaimEntity,
    projectId: number,
  ): Promise<ReclaimEntity> {
    const project = await this.projectService.get(projectId);
    return this.save({
      ...reclaim,
      owner,
      project,
    });
  }

  async myReclaims(
    ownerId: number,
    take: number,
    skip: number,
  ): Promise<ReclaimEntity[]> {
    return this.reclaimRepository
      .createQueryBuilder('reclaim')
      .leftJoin('reclaim.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
      .select([
        'reclaim.id',
        'reclaim.hash',
        'reclaim.value',
        'reclaim.chainId',
        'reclaim.created_at',
      ])
      .take(take)
      .skip(skip)
      .getMany();
  }

  async reclaimsOfProject(
    projectId: number,
    take: number,
    skip: number,
  ): Promise<ReclaimEntity[]> {
    return this.reclaimRepository
      .createQueryBuilder('reclaim')
      .leftJoin('reclaim.project', 'project')
      .where('project.id = :projectId', { projectId })
      .andWhere('reclaim.validation = :validation', { validation: true })
      .select([
        'reclaim.id',
        'reclaim.hash',
        'reclaim.value',
        'reclaim.chainId',
        'reclaim.created_at',
        'project.walletAddressProxy',
      ])
      .take(take)
      .skip(skip)
      .getMany();
  }

  async reclaimsValueOfProject(projectId: number): Promise<number> {
    const { reclaimSum } = await this.reclaimRepository
      .createQueryBuilder('reclaim')
      .leftJoin('reclaim.project', 'project')
      .where('project.id = :projectId', { projectId })
      .andWhere('reclaim.validation = :validation', { validation: true })
      .select('SUM(reclaim.value)', 'reclaimSum')
      .getRawOne();
    return +reclaimSum;
  }

  async closeReclaimAfterOneWeek(){
    //withdraw possible
  }

  async save(reclaim: ReclaimEntity): Promise<ReclaimEntity> {
    try {
      return this.reclaimRepository.save(reclaim);
    } catch (error) {
      throw new HttpException(
        JSON.stringify(error?.driverError?.detail),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkValidationTx() {
    const reclaims = await this.reclaimRepository
      .createQueryBuilder('reclaim')
      .leftJoin('reclaim.project', 'project')
      .leftJoin('project.owner', 'projectOwner')
      .leftJoin('project.reclaims', 'projectReclaims')
      .leftJoin('projectReclaims.owner', 'projectReclaimsOwner')
      .where('reclaim.validation = :validation', { validation: false })
      .select([
        'reclaim.id',
        'reclaim.hash',
        'reclaim.value',
        'reclaim.chainId',
        'reclaim.created_at',
        'project.walletAddressProxy',
        'project.title',
        'projectOwner.id',
        'projectReclaims.id',
        'projectReclaimsOwner.id',
      ])
      .getMany();

    if (reclaims.length) {
      if (!dataSource.isInitialized) await dataSource.initialize();
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        for (const reclaim of reclaims) {
          let tx: TransactionReceipt;
          try {
            tx = await this.helperBlockchainService.getStatusTransaction(
              this.alchemyKey,
              reclaim.hash,
              reclaim.chainId,
            );
          } catch (error) {
            console.log(error);
          }

          if (
            !tx ||
            tx.to !== reclaim.project.walletAddressProxy ||
            Date.now() > reclaim.created_at.getTime() + 86400000
          ) {
            await queryRunner.manager.delete(ReclaimEntity, reclaim.id);
          } else if (tx?.status === 1 && tx?.status === 1) {
            await this.notificationService.newReclaim(reclaim, queryRunner);
            await queryRunner.manager.save(ReclaimEntity, {
              ...reclaim,
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
