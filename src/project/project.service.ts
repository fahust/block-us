import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProjectService {
  private saltOrRounds: number;
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
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
