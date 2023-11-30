import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async get(id: number): Promise<CommentEntity> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.id = :id', { id })
      .getOne();
  }

  async save(comment: CommentEntity): Promise<CommentEntity> {
    return this.commentRepository.save(comment);
  }
}
