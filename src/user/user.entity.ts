import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import { ProjectEntity } from 'src/project/project.entity';
import {
  Entity,
  Column,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @MinLength(42)
  @MaxLength(42)
  @Column()
  address: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  @ManyToMany(() => CommentEntity, (comment) => comment.likes)
  comments: CommentEntity[];

  @ApiProperty()
  @Column()
  @OneToMany(() => ProjectEntity, (project) => project.owner)
  projects: ProjectEntity[];
}
