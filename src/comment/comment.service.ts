import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { UserEntity } from 'src/user/user.entity';
import { ProjectService } from 'src/project/project.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    private projectService: ProjectService,
    private notificationService: NotificationService,
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
    const commentSaved = await this.save({
      ...comment,
      owner,
      project,
    });
    await this.notificationService.newComment(project);
    return commentSaved;
  }

  async like(user: UserEntity, commentId: number): Promise<CommentEntity> {
    const comment = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.id = :commentId', { commentId })
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

    const alreadyLiked = comment.likes.find((like) => like.id === user.id);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((like) => like.id !== user.id);
      comment.liked = null;
    } else {
      comment.likes.push(user);
      comment.liked = user;
    }
    await this.save(comment);
    return comment;
  }

  async save(comment: CommentEntity): Promise<CommentEntity> {
    return this.commentRepository.save(comment);
  }
}
