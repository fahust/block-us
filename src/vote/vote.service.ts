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

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteEntity)
    private voteRepository: Repository<VoteEntity>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {}

  async get(id: number): Promise<VoteEntity> {
    return this.voteRepository
      .createQueryBuilder('vote')
      .where('vote.id = :id', { id })
      .getOne();
  }

  async create(
    owner: UserEntity,
    vote: VoteEntity,
    projectId: number,
  ): Promise<VoteEntity> {
    const project = await this.projectService.get(projectId);
    return this.save({
      ...vote,
      owner,
      project,
    });
  }

  async myVotes(ownerId: number): Promise<Omit<VoteEntity, 'owner'>[]> {
    const votes = await this.voteRepository
      .createQueryBuilder('vote')
      .leftJoinAndSelect('vote.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
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
      .leftJoinAndSelect('vote.project', 'project')
      .where('project.id = :projectId', { projectId })
      .andWhere('vote.validation = :validation', { validation: true })
      .getMany();

    return votes.map((i) => {
      const { owner: _, project: __, ...vote } = i;
      return vote;
    });
  }

  async votesValueOfProject(projectId: number): Promise<number> {
    const votes = await this.votesOfProject(projectId);

    return votes.reduce(
      (accumulator, currentValue) => accumulator + currentValue.value,
      0,
    );
  }

  async save(vote: VoteEntity): Promise<VoteEntity> {
    try {
      return await this.voteRepository.save(vote);
    } catch (error) {
      throw new HttpException(
        JSON.stringify(error?.driverError?.detail),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
