import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async get(id: number): Promise<ArticleEntity> {
    return this.articleRepository
      .createQueryBuilder('article')
      .where('article.id = :id', { id })
      .getOne();
  }

  async create(article: ArticleEntity, projectId: number): Promise<ArticleEntity> {
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

  async save(article: ArticleEntity): Promise<ArticleEntity> {
    return this.articleRepository.save(article);
  }
}
