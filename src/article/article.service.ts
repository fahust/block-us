import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { ProjectService } from 'src/project/project.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    private projectService: ProjectService,
    private notificationService: NotificationService,
  ) {}

  async get(owner: UserEntity, articleId: number): Promise<ArticleEntity> {
    return this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.project', 'project')
      .leftJoin('project.owner', 'owner')
      .where('article.id = :articleId', { articleId })
      .andWhere('article.visible = :visible OR owner.id = :ownerId', {
        visible: true,
        ownerId: owner.id,
      })
      .getOne();
  }

  async create(
    article: ArticleEntity,
    projectId: number,
  ): Promise<ArticleEntity> {
    const project = await this.projectService.get(projectId);
    const articleSaved = await this.save({
      ...article,
      project,
    });
    await this.notificationService.newArticle(project);
    return articleSaved;
  }

  async like(user: UserEntity, articleId: number): Promise<ArticleEntity> {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.id = :articleId', { articleId })
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

    const alreadyLiked = article.likes.find((like) => like.id === user.id);

    if (alreadyLiked) {
      article.likes = article.likes.filter((like) => like.id !== user.id);
      article.liked = null;
    } else {
      article.likes.push(user);
      article.liked = user;
    }
    await this.save(article);
    return article;
  }

  async update(
    owner: UserEntity,
    article: ArticleEntity,
  ): Promise<ArticleEntity> {
    let edit = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.project', 'project')
      .leftJoin('project.owner', 'owner')
      .where('article.id = :articleId', { articleId: article.id })
      .andWhere('owner.id = :ownerId', { ownerId: owner.id })
      .getOneOrFail();
    const { title, content, image, visible } = article;
    edit = { ...edit, title, content, image, visible };
    return this.save(edit);
  }

  async delete(owner: UserEntity, articleId: number): Promise<DeleteResult> {
    const article = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.project', 'project')
      .leftJoin('project.owner', 'owner')
      .where('article.id = :articleId', { articleId })
      .andWhere('owner.id = :ownerId', { ownerId: owner.id })
      .getOneOrFail();
    return this.articleRepository.delete(article);
  }

  async save(article: ArticleEntity): Promise<ArticleEntity> {
    return this.articleRepository.save(article);
  }
}
