import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  async get(id: number): Promise<ProjectEntity> {
    return this.projectRepository
      .createQueryBuilder('project')
      .where('project.id = :id', { id })
      .getOne();
  }

  async save(project: ProjectEntity): Promise<ProjectEntity> {
    return this.projectRepository.save(project);
  }
}
