import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, QueryRunner } from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { ProjectService } from 'src/project/project.service';
import { InvestEntity } from 'src/invest/invest.entity';
import { NewsEntity } from 'src/news/news.entity';
import dataSource from 'db/data-source';
import { ProjectEntity } from 'src/project/project.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {}

  async get(id: number): Promise<NotificationEntity> {
    return this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.id = :id', { id })
      .select([
        'notification.id',
        'notification.content',
        'notification.read',
        'notification.created_at',
      ])
      .getOne();
  }

  async myNotifications(
    ownerId: number,
    take: number,
    skip: number,
  ): Promise<NotificationEntity[]> {
    return this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoin('notification.owner', 'owner')
      .where('owner.id = :ownerId', { ownerId })
      .select([
        'notification.id',
        'notification.content',
        'notification.read',
        'notification.created_at',
      ])
      .take(take)
      .skip(skip)
      .getMany();
  }

  async readNotification(ownerId: number): Promise<UpdateResult> {
    return this.notificationRepository
      .createQueryBuilder()
      .update(NotificationEntity)
      .set({
        read: true,
      })
      .where('owner.id = :ownerId', { ownerId })
      .execute();
  }

  async newInvestment(invest: InvestEntity, queryRunner: QueryRunner) {
    const uniqueInvestors = invest.project.invests?.filter(
      (i1, index) =>
        invest.project.invests.findIndex(
          (i2: InvestEntity) => i1?.owner.id === i2?.owner.id,
        ) === index,
    );

    for (const investor of uniqueInvestors) {
      const notification = new NotificationEntity();
      notification.owner = investor.owner;
      notification.project = invest.project;
      notification.content = `New investment of ${invest.value} wei for project ${invest.project.title}`;
      await queryRunner.manager.save(NotificationEntity, notification);
    }

    const notification = new NotificationEntity();
    notification.owner = invest.project.owner;
    notification.project = invest.project;
    notification.content = `New investment of ${invest.value} wei for your project ${invest.project.title}`;
    await queryRunner.manager.save(NotificationEntity, notification);
  }

  async newArticle(project: ProjectEntity) {
    if (!dataSource.isInitialized) await dataSource.initialize();
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const uniqueInvestors = project.invests?.filter(
        (i1, index) =>
          project.invests.findIndex(
            (i2: InvestEntity) => i1?.owner.id === i2?.owner.id,
          ) === index,
      );

      for (const investor of uniqueInvestors) {
        const notification = new NotificationEntity();
        notification.owner = investor.owner;
        notification.project = project;
        notification.content = `New article for project ${project.title}`;
        await queryRunner.manager.save(NotificationEntity, notification);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async newVote(project: ProjectEntity) {
    if (!dataSource.isInitialized) await dataSource.initialize();
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const uniqueInvestors = project.invests?.filter(
        (i1, index) =>
          project.invests.findIndex(
            (i2: InvestEntity) => i1?.owner.id === i2?.owner.id,
          ) === index,
      );

      for (const investor of uniqueInvestors) {
        const notification = new NotificationEntity();
        notification.owner = investor.owner;
        notification.project = project;
        notification.content = `New vote for project ${project.title}`;
        await queryRunner.manager.save(NotificationEntity, notification);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async save(notification: NotificationEntity): Promise<NotificationEntity> {
    try {
      return this.notificationRepository.save(notification);
    } catch (error) {
      throw new HttpException(
        JSON.stringify(error?.driverError?.detail),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
