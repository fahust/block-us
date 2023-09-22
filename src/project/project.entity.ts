import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
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
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class ProjectEntity extends BaseEntity {
  @ApiProperty()
  @IsEthereumAddress()
  @Column({ unique: true })
  walletAddressToken: string;

  @ApiProperty()
  @IsEthereumAddress()
  @Column({ unique: true })
  walletAddressProxy: string;

  @ApiProperty()
  @IsString()
  @Column({ unique: true })
  hashToken: string;

  @ApiProperty()
  @IsString()
  @Column({ unique: true })
  hashProxy: string;

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
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(3000)
  @Column()
  mainCategory: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(3000)
  @Column()
  subCategory: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  @Column({ nullable: true })
  image: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Column({ default: false })
  deployed: boolean;

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
