import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import { InvestEntity } from 'src/invest/invest.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class ProjectEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Column({ unique: true })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(3000)
  @Column()
  description: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  @Column({ nullable: true })
  image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @OneToMany(() => CommentEntity, (comment) => comment.project, {
    cascade: true,
    eager: true,
  })
  comments: CommentEntity;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToOne(() => UserEntity, (user) => user.projects)
  owner: UserEntity;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @OneToMany(() => InvestEntity, (invest) => invest.project)
  invests: InvestEntity[];
}
