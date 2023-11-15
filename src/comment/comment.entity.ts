import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
  ManyToOne,
} from 'typeorm';

@Entity()
export class CommentEntity extends BaseEntity {
  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @Column()
  @OneToMany(() => CommentEntity, (comment) => comment.parent, {
    cascade: true,
    eager: true,
  })
  answers: CommentEntity[];

  @ApiProperty()
  @Column()
  @ManyToOne(() => CommentEntity, (comment) => comment.answers, {
    orphanedRowAction: 'soft-delete',
  })
  parent: CommentEntity;

  @ApiProperty()
  @Column()
  @ManyToMany(() => UserEntity, (user) => user.likes, {
    cascade: true,
    eager: true,
  })
  likes: UserEntity[];

  @ApiProperty()
  @Column()
  @ManyToOne(() => ProjectEntity, (project) => project.comments, {
    orphanedRowAction: 'soft-delete',
  })
  project: ProjectEntity;
}
