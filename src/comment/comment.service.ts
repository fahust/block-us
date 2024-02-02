import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { UserEntity } from 'src/user/user.entity';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private projectService: ProjectService,
  ) {}

  async get(id: number): Promise<CommentEntity> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id })
      .select([
        'comment.id',
        'comment.title',
        'comment.content',
        'comment.created_at',
      ])
      .getOne();
  }

  async create(
    owner: UserEntity,
    comment: CommentEntity,
    projectId: number,
  ): Promise<CommentEntity> {
    const project = await this.projectService.get(projectId);
    return this.save({
      ...comment,
      owner,
      project,
    });
  }

  async save(comment: CommentEntity): Promise<CommentEntity> {
    return this.commentRepository.save(comment);
  }
}
