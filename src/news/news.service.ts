import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';
import { ProjectService } from 'src/project/project.service';
import { NotificationService } from 'src/notification/notification.service';

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

  async save(news: NewsEntity): Promise<NewsEntity> {
    return this.newsRepository.save(news);
  }
}
