import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { InvestService } from 'src/invest/invest.service';
import { HelperBlockchainService } from 'src/helper/service/helper.blockchain.service';
import dataSource from 'db/data-source';
import { TransactionReceipt } from 'ethers';

@Injectable()
export class ProjectService {
  private alchemyKey: string;

  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @Inject(forwardRef(() => InvestService))
    private investService: InvestService,
    private configService: ConfigService,
    private helperBlockchainService: HelperBlockchainService,
  ) {
    this.alchemyKey = this.configService.get('ALCHEMY_KEY');
  }

  async get(id: number): Promise<ProjectEntity> {
    return this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :id', { id })
      .leftJoin('project.invests', 'invests')
      .leftJoin('project.owner', 'owner')
      .leftJoin('project.news', 'news')
      .leftJoin('project.comments', 'comments')
      .select([
        'project.id',
        'project.walletAddressToken',
        'project.walletAddressProxy',
        'project.hashToken',
        'project.hashProxy',
        'project.chainId',
        'project.title',
        'project.description',
        'project.shortDescription',
        'project.mainCategory',
        'project.subCategory',
        'project.image',
        'project.startFundraising',
        'project.endFundraising',
        'project.maxSupply',
        'invests.id',
        'invests.value',
        'invests.validation',
        'owner.id',
        'news.id',
        'news.title',
        'news.content',
        'news.image',
        'comments.id',
        'comments.title',
        'comments.content',
      ])
      .loadRelationCountAndMap('project.likes', 'project.likes')
      .loadRelationCountAndMap('news.likes', 'news.likes')
      .loadRelationCountAndMap('comments.likes', 'comments.likes')
      .getOne();
  }

  async search(
    searchTerm: number,
    userId: number,
    limit: number,
    skip: number,
  ): Promise<ProjectEntity[]> {
    return this.projectRepository
      .createQueryBuilder('project')
      .where('project.description like :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('project.shortDescription ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('project.title ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .leftJoin('project.news', 'news')
      .leftJoin('project.comments', 'comments')
      .select([
        'project.id',
        'project.title',
        'project.shortDescription',
        'project.mainCategory',
        'project.subCategory',
        'project.image',
        'project.startFundraising',
        'project.endFundraising',
        'project.maxSupply',
        'owner.id',
      ])
      .loadRelationCountAndMap('project.news', 'project.news')
      .loadRelationCountAndMap('project.comments', 'project.comments')
      .loadRelationCountAndMap('project.likes', 'project.likes')
      .loadRelationCountAndMap('news.likes', 'news.likes')
      .loadRelationCountAndMap('comments.likes', 'comments.likes')
      .leftJoinAndMapOne(
        'project.liked',
        'project.likes',
        'likes',
        'likes.id = :userId',
        {
          userId,
        },
      )
      .limit(limit)
      .skip(skip)
      .getMany();
  }

  async byCategory(
    mainCategory: number,
    userId: number,
    limit: number,
    skip: number,
  ): Promise<ProjectEntity[]> {
    return this.projectRepository
      .createQueryBuilder('project')
      .where('project.mainCategory = :mainCategory', {
        mainCategory,
      })
      .leftJoin('project.owner', 'owner')
      .select([
        'project.id',
        'project.title',
        'project.shortDescription',
        'project.mainCategory',
        'project.subCategory',
        'project.image',
        'project.startFundraising',
        'project.endFundraising',
        'project.maxSupply',
        'owner.id',
      ])
      .loadRelationCountAndMap('project.news', 'project.news')
      .loadRelationCountAndMap('project.comments', 'project.comments')
      .loadRelationCountAndMap('project.likes', 'project.likes')
      .leftJoinAndMapOne(
        'project.liked',
        'project.likes',
        'likes',
        'likes.id = :userId',
        {
          userId,
        },
      )
      .limit(limit)
      .skip(skip)
      .getMany();
  }

  async isInvest(userId: number, projectId: number): Promise<Boolean> {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :projectId', { projectId })
      .leftJoinAndSelect('project.invests', 'invests')
      .getOneOrFail();

    const isInvest = project.invests.find(
      (invest) => invest.owner.id === userId,
    );
    return isInvest ? true : false;
  }

  async isOwner(userId: number, projectId: number): Promise<ProjectEntity> {
    try {
      return this.projectRepository
        .createQueryBuilder('project')
        .leftJoin('project.owner', 'owner')
        .where('project.id = :projectId', { projectId })
        .andWhere('owner.id = :userId', { userId })
        .getOneOrFail();
    } catch (error) {
      throw new HttpException(JSON.stringify(error), HttpStatus.NOT_FOUND);
    }
  }

  async create(
    owner: UserEntity,
    project: ProjectEntity,
  ): Promise<ProjectEntity> {
    return this.save({
      ...project,
      owner,
    });
  }

  async like(user: UserEntity, projectId: number): Promise<ProjectEntity> {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :projectId', { projectId })
      .leftJoinAndMapOne(
        'project.liked',
        'project.likes',
        'liked',
        'liked.id = :userId',
        {
          userId: user.id,
        },
      )
      .leftJoinAndSelect('project.likes', 'likes')
      .getOneOrFail();

    const alreadyLiked = project.likes.find((like) => like.id === user.id);

    if (alreadyLiked) {
      project.likes = project.likes.filter((like) => like.id !== user.id);
      project.liked = null;
    } else {
      project.likes.push(user);
      project.liked = user;
    }
    await this.save(project);
    return project;
  }

  async save(project: ProjectEntity): Promise<ProjectEntity> {
    try {
      return await this.projectRepository.save(project);
    } catch (error) {
      throw new HttpException(
        JSON.stringify(error?.driverError?.detail),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkContractDeployTx() {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.deployed = :deployed', { deployed: false })
      .select([
        'project.id',
        'project.hashToken',
        'project.hashProxy',
        'project.walletAddressToken',
        'project.walletAddressProxy',
        'project.chainId',
        'project.created_at',
      ])
      .getMany();

    if (projects.length) {
      if (!dataSource.isInitialized) await dataSource.initialize();
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        for (const project of projects) {
          let txToken: TransactionReceipt;
          let txProxy: TransactionReceipt;
          try {
            txToken = await this.helperBlockchainService.getStatusTransaction(
              this.alchemyKey,
              project.hashToken,
              project.chainId,
            );

            txProxy = await this.helperBlockchainService.getStatusTransaction(
              this.alchemyKey,
              project.hashProxy,
              project.chainId,
            );
          } catch (error) {}

          if (
            !txToken ||
            !txProxy ||
            txToken.contractAddress !== project.walletAddressToken ||
            txProxy.contractAddress !== project.walletAddressProxy ||
            Date.now() > project.created_at.getTime() + 86400000
          ) {
            await queryRunner.manager.delete(ProjectEntity, project.id);
          } else if (txToken?.status === 1 && txProxy?.status === 1) {
            await queryRunner.manager.save(ProjectEntity, {
              ...project,
              deployed: true,
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
