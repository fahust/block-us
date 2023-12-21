import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEthereumAddress, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import { InvestEntity } from 'src/invest/invest.entity';
import { ProjectEntity } from 'src/project/project.entity';
import { Entity, Column, ManyToMany, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @IsEthereumAddress()
  @Column({ unique: true })
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Column({ unique: true })
  name: string;

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

  @ApiProperty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Column()
  lastName: string;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToMany(() => CommentEntity, (comment) => comment.likes)
  comments: CommentEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @OneToMany(() => ProjectEntity, (project) => project.owner)
  projects: ProjectEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @OneToMany(() => InvestEntity, (invest) => invest.owner)
  invests: InvestEntity[];
}
