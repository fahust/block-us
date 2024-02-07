import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';
import { ProjectService } from 'src/project/project.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
    private projectService: ProjectService,
    private notificationService: NotificationService,
  ) {}

  async get(id: number): Promise<NewsEntity> {
    return this.newsRepository
      .createQueryBuilder('news')
      .where('news.id = :id', { id })
      .getOne();
  }

  async create(news: NewsEntity, projectId: number): Promise<NewsEntity> {
    const project = await this.projectService.get(projectId);
    const newsSaved = await this.save({
      ...news,
      project,
    });
    await this.notificationService.newArticle(project);
    return newsSaved;
  }

  async like(user: UserEntity, newsId: number): Promise<NewsEntity> {
    const news = await this.newsRepository
      .createQueryBuilder('news')
      .where('news.id = :newsId', { newsId })
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

    const alreadyLiked = news.likes.find((like) => like.id === user.id);

    if (alreadyLiked) {
      news.likes = news.likes.filter((like) => like.id !== user.id);
      news.liked = null;
    } else {
      news.likes.push(user);
      news.liked = user;
    }
    await this.save(news);
    return news;
  }

  async save(news: NewsEntity): Promise<NewsEntity> {
    return this.newsRepository.save(news);
  }
}
