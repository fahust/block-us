import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { BaseEntity } from 'src/helper/entity/base.entity';
import { InvestEntity } from 'src/invest/invest.entity';
import { ProjectEntity } from 'src/project/project.entity';
import { Entity, Column, ManyToMany, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { VoteEntity } from 'src/vote/vote.entity';
import { NewsEntity } from 'src/news/news.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @IsEthereumAddress()
  @Column({ unique: true })
  walletAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Column({ unique: true, nullable: true })
  name: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  @Column({ nullable: true })
  image: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @Column({ unique: true, nullable: true })
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Column({ nullable: true })
  lastName: string;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToMany(() => CommentEntity, (comment) => comment.owner)
  comments: CommentEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToMany(() => CommentEntity, (comment) => comment.likes)
  commentsLiked: CommentEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToMany(() => ProjectEntity, (project) => project.likes)
  projectLiked: ProjectEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToMany(() => NewsEntity, (news) => news.likes)
  newsLiked: NewsEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @OneToMany(() => ProjectEntity, (project) => project.owner)
  projects: ProjectEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @OneToMany(() => InvestEntity, (invest) => invest.owner)
  invests: InvestEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @OneToMany(() => InvestEntity, (vote) => vote.owner)
  votes: VoteEntity[];
}
