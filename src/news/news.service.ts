import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
  ) {}

  async news(id: number): Promise<NewsEntity> {
    return this.newsRepository
      .createQueryBuilder('news')
      .where('news.id = :id', { id })
      .getOne();
  }

  async detail(id: number): Promise<NewsEntity> {
    return this.newsRepository
      .createQueryBuilder('news')
      .where('news.id = :id', { id })
      .getOne();
  }

  async save(news: NewsEntity): Promise<NewsEntity> {
    return this.newsRepository.save(news);
  }
}
