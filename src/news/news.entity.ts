import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseEntity } from 'src/helper/entity/base.entity';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, ManyToOne,ManyToMany } from 'typeorm';

@Entity()
export class NewsEntity extends BaseEntity {
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

  @ApiPropertyOptional()
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  @Column({ nullable: true })
  image: string;

  @ApiProperty()
  @IsBoolean()
  @Column({ default: true })
  public: boolean;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToOne(() => ProjectEntity, (project) => project.comments, {
    orphanedRowAction: 'soft-delete',
  })
  project: ProjectEntity;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToMany(() => UserEntity, (user) => user.newsLiked, {
    cascade: true,
    eager: true,
  })
  likes: UserEntity[];
}
