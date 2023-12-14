import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { InvestService } from 'src/invest/invest.service';

@Injectable()
export class ProjectService {
  private saltOrRounds: number;
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    @Inject(forwardRef(() => InvestService))
    private investService: InvestService,
    private configService: ConfigService,
  ) {
    this.saltOrRounds = this.configService.get<number>('SALT_PASSWORD');
  }

  async get(id: number): Promise<Omit<ProjectEntity, 'password'>> {
    const { password: _, ...project } = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :id', { id })
      .getOne();
    return project;
  }

  async search(
    searchTerm: number,
    limit: number,
    skip: number,
  ): Promise<Omit<ProjectEntity, 'password'>[]> {
    const projects = await this.projectRepository
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

    return projects.map((p) => {
      const { password: _, ...project } = p;
      return project;
    });
  }

  async isInvest(userId: number, projectId: number) {
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

  async isOwner(userId: number, projectId: number) {
    try {
      const {
        password: _,
        owner: { password: __ },
        ...newProject
      } = await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.owner', 'owner')
        .where('project.id = :projectId', { projectId })
        .andWhere('owner.id = :userId', { userId })
        .getOneOrFail();

      return newProject;
    } catch (error) {
      throw new HttpException(JSON.stringify(error), HttpStatus.NOT_FOUND);
    }
  }

  async create(
    owner: UserEntity,
    project: ProjectEntity,
  ): Promise<Omit<ProjectEntity, 'password'>> {
    const hash = bcrypt.hashSync(project.password, +this.saltOrRounds);
    const { password: _, ...newProject } = await this.save({
      ...project,
      owner,
      password: hash,
    });

    return newProject;
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
}
