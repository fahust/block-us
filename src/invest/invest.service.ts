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

@Injectable()
export class InvestService {
  constructor(
    @InjectRepository(InvestEntity)
    private investRepository: Repository<InvestEntity>,
    @Inject(forwardRef(() => ProjectService))
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

  async myInvests(ownerId: number): Promise<Omit<InvestEntity, 'owner'>[]> {
    const invests = await this.investRepository
      .createQueryBuilder('invest')
      .leftJoinAndSelect('invest.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
      .getMany();
    return invests.map((i) => {
      const { owner: _, ...invest } = i;
      return invest;
    });
  }

  async investsOfProject(projectId: number) {
    const invests = await this.investRepository
      .createQueryBuilder('invest')
      .leftJoinAndSelect('invest.project', 'project')
      .where('project.id = :projectId', { projectId })
      .getMany();
      
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
}
