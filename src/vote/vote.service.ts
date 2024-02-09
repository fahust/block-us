import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoteEntity } from './vote.entity';
import { UserEntity } from 'src/user/user.entity';
import { ProjectService } from 'src/project/project.service';
import { TransactionReceipt } from 'ethers';
import dataSource from 'db/data-source';
import { HelperBlockchainService } from 'src/helper/service/helper.blockchain.service';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class VoteService {
  private alchemyKey: string;
  constructor(
    @InjectRepository(VoteEntity)
    private voteRepository: Repository<VoteEntity>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private helperBlockchainService: HelperBlockchainService,
    private configService: ConfigService,
  ) {
    this.alchemyKey = this.configService.get('ALCHEMY_KEY');
  }

  async get(id: number): Promise<VoteEntity> {
    return this.voteRepository
      .createQueryBuilder('vote')
      .where('vote.id = :id', { id })
      .select(['vote.id', 'vote.value', 'vote.chainId', 'vote.created_at'])
      .getOne();
  }

  async create(
    owner: UserEntity,
    vote: VoteEntity,
    projectId: number,
  ): Promise<VoteEntity> {
    const project = await this.projectService.get(projectId);
    const voteSaved = await this.save({
      ...vote,
      owner,
      project,
    });
    await this.notificationService.newVote(project);
    return voteSaved;
  }

  async myVotes(ownerId: number): Promise<Omit<VoteEntity, 'owner'>[]> {
    const votes = await this.voteRepository
      .createQueryBuilder('vote')
      .leftJoin('vote.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
      .select(['vote.id', 'vote.value', 'vote.chainId', 'vote.created_at'])
      .getMany();
    return votes.map((i) => {
      const { owner: _, ...vote } = i;
      return vote;
    });
  }

  async votesOfProject(
    projectId: number,
  ): Promise<Omit<VoteEntity, 'owner' | 'project'>[]> {
    const votes = await this.voteRepository
      .createQueryBuilder('vote')
      .leftJoin('vote.project', 'project')
      .where('project.id = :projectId', { projectId })
      .andWhere('vote.validation = :validation', { validation: true })
      .select(['vote.id', 'vote.value', 'vote.chainId', 'vote.created_at'])
      .getMany();

    return votes.map((i) => {
      const { owner: _, project: __, ...vote } = i;
      return vote;
    });
  }

  async votesValueOfProject(projectId: number): Promise<number> {
    const { voteSum } = await this.voteRepository
      .createQueryBuilder('vote')
      .leftJoin('vote.project', 'project')
      .where('project.id = :projectId', { projectId })
      .andWhere('vote.validation = :validation', { validation: true })
      .select('SUM(vote.value)', 'voteSum')
      .getRawOne();
    return +voteSum;
  }

  async save(vote: VoteEntity): Promise<VoteEntity> {
    try {
      return this.voteRepository.save(vote);
    } catch (error) {
      throw new HttpException(
        JSON.stringify(error?.driverError?.detail),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkValidationTx() {
    const votes = await this.voteRepository
      .createQueryBuilder('vote')
      .where('vote.validation = :validation', { validation: false })
      .leftJoin('vote.project', 'project')
      .select([
        'vote.id',
        'vote.hash',
        'vote.chainId',
        'vote.created_at',
        'project.walletAddressProxy',
      ])
      .getMany();

    if (votes.length) {
      if (!dataSource.isInitialized) await dataSource.initialize();
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        for (const vote of votes) {
          let tx: TransactionReceipt;
          try {
            tx = await this.helperBlockchainService.getStatusTransaction(
              this.alchemyKey,
              vote.hash,
              vote.chainId,
            );
          } catch (error) {}

          if (
            !tx ||
            tx.contractAddress !== vote.project.walletAddressProxy ||
            Date.now() > vote.created_at.getTime() + 86400000
          ) {
            await queryRunner.manager.delete(VoteEntity, vote.id);
          } else if (tx?.status === 1 && tx?.status === 1) {
            await queryRunner.manager.save(VoteEntity, {
              ...vote,
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
