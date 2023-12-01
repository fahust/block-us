import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, OneToMany, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class CommentEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Column()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(3000)
  @Column()
  content: string;

  @ApiProperty({ type: 'object' })
  @OneToMany(() => CommentEntity, (comment) => comment.parent, {
    cascade: true,
    eager: true,
  })
  answers: CommentEntity[];

  @ApiProperty({ type: 'object' })
  @ManyToOne(() => CommentEntity, (comment) => comment.answers, {
    orphanedRowAction: 'soft-delete',
  })
  parent: CommentEntity;

  @ApiProperty({ type: 'object' })
  @ManyToMany(() => UserEntity, (user) => user.comments, {
    cascade: true,
    eager: true,
  })
  likes: UserEntity[];

  @ApiProperty({ type: 'object' })
  @ManyToOne(() => ProjectEntity, (project) => project.comments, {
    orphanedRowAction: 'soft-delete',
  })
  project: ProjectEntity;
}
