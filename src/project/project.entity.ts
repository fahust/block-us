import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class ProjectEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  @OneToMany(() => CommentEntity, (comment) => comment.project, {
    cascade: true,
    eager: true,
  })
  comments: CommentEntity;

  @ApiProperty()
  @Column()
  @ManyToOne(() => UserEntity, (user) => user.projects)
  owner: UserEntity;
}
