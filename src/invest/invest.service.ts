import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestEntity } from './invest.entity';
import { UserEntity } from 'src/user/user.entity';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class InvestService {
  constructor(
    @InjectRepository(InvestEntity)
    private investRepository: Repository<InvestEntity>,
    private projectService: ProjectService,
  ) {}

  async get(id: number): Promise<InvestEntity> {
    return this.investRepository
      .createQueryBuilder('invest')
      .where('invest.id = :id', { id })
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

  async save(invest: InvestEntity): Promise<InvestEntity> {
    return this.investRepository.save(invest);
  }
}
