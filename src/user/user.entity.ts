import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import { InvestEntity } from 'src/invest/invest.entity';
import { ProjectEntity } from 'src/project/project.entity';
import { Entity, Column, ManyToMany, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @MinLength(42)
  @MaxLength(42)
  @Column()
  address: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @Column()
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  password: string;

  @ApiProperty()
  @IsEmail()
  @Column()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
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

  @ApiProperty()
  @Column()
  @OneToMany(() => InvestEntity, (invest) => invest.owner)
  invests: InvestEntity[];
}
