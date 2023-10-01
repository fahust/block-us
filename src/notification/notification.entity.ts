import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/helper/entity/base.entity';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, ManyToOne, Unique } from 'typeorm';

@Entity()
export class NotificationEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column()
  content: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Column({ default: false })
  read: boolean;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToOne(() => ProjectEntity, (project) => project.invests)
  project: ProjectEntity;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToOne(() => UserEntity, (user) => user.notifications)
  owner: UserEntity;
}
