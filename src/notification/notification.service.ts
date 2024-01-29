import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { NotificationEntity } from './notification.entity';
import { UserEntity } from 'src/user/user.entity';
import { ProjectService } from 'src/project/project.service';

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
