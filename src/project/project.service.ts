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
import * as bcrypt from 'bcryptjs';
import { InvestService } from 'src/invest/invest.service';
import { HelperBlockchainService } from 'src/helper/service/helper.blockchain.service';
import dataSource from 'db/data-source';

@Injectable()
export class ProjectService {
  private saltOrRounds: number;
  private alchemyKey: string;
  private metamaskPrivateKey: string;

  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @Inject(forwardRef(() => InvestService))
    private investService: InvestService,
    private configService: ConfigService,
    private helperBlockchainService: HelperBlockchainService,
  ) {
    this.saltOrRounds = this.configService.get<number>('SALT_PASSWORD');
    this.alchemyKey = this.configService.get('ALCHEMY_KEY');
    this.metamaskPrivateKey = this.configService.get('METAMASK_PRIVATE_KEY');
  }

  async get(id: number): Promise<ProjectEntity> {
    return this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :id', { id })
      .getOne();
  }

  async search(
    searchTerm: number,
    limit: number,
    skip: number,
  ): Promise<ProjectEntity[]> {
    return this.projectRepository
      .createQueryBuilder('project')
      .where('project.description like :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .orWhere('project.title ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
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

  async isOwner(
    userId: number,
    projectId: number,
  ): Promise<Omit<ProjectEntity, 'password' | 'owner'>> {
    try {
      return this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.owner', 'owner')
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
      .getMany();

    if (projects.length) {
      await dataSource.initialize();
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        for (const project of projects) {
          const txToken =
            await this.helperBlockchainService.getStatusTransaction(
              this.alchemyKey,
              project.hashToken,
            );

          const txProxy =
            await this.helperBlockchainService.getStatusTransaction(
              this.alchemyKey,
              project.hashProxy,
            );

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
