import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxDate,
  MaxLength,
  Min,
  MinDate,
  MinLength,
} from 'class-validator';
import { CommentEntity } from 'src/comment/comment.entity';
import { BaseEntity } from 'src/helper/entity/base.entity';
import { ChainId } from 'src/helper/enum/network.enum';
import { InvestEntity } from 'src/invest/invest.entity';
import { NewsEntity } from 'src/news/news.entity';
import { UserEntity } from 'src/user/user.entity';
import { VoteEntity } from 'src/vote/vote.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm';

@Entity()
@Unique('project_address_hash_index', [
  'walletAddressToken',
  'walletAddressProxy',
  'hashToken',
  'hashProxy',
  'chainId',
])
export class ProjectEntity extends BaseEntity {
  @ApiProperty()
  @IsEthereumAddress()
  @Column({ select: false })
  walletAddressToken: string;

  @ApiProperty()
  @IsEthereumAddress()
  @Column({ select: false })
  walletAddressProxy: string;

  @ApiProperty()
  @IsString()
  @Column({ select: false })
  hashToken: string;

  @ApiProperty()
  @IsString()
  @Column({ select: false })
  hashProxy: string;

  @ApiProperty()
  @IsEnum(ChainId)
  @Column({ select: false })
  chainId: ChainId;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Column({ select: false })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10000)
  @Column({ select: false })
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  @Column({ select: false })
  shortDescription: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Column({ select: false })
  mainCategory: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Column({ select: false })
  subCategory: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  @Column({ nullable: true, select: false })
  image: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Column({ default: false, select: false })
  deployed: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({ select: false })
  pausable: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({ select: false })
  rulesModifiable: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column({ select: false })
  voteToWithdraw: boolean;

  @ApiProperty()
  @IsNumber()
  @Column({ select: false })
  dayToWithdraw: number;

  @ApiProperty()
  @IsDate()
  @MinDate(new Date())
  @MaxDate(addYears(new Date(), 1))
  @Column({ select: false })
  startFundraising: Date;

  @ApiProperty()
  @IsNumber()
  @MinDate(new Date())
  @MaxDate(addYears(new Date(), 1))
  @Column({ select: false })
  endFundraising: Date;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(1000000000)
  @Column({ select: false })
  maxSupply: number;

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

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @OneToMany(() => VoteEntity, (vote) => vote.project)
  votes: VoteEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @OneToMany(() => NewsEntity, (news) => news.project)
  news: NewsEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToMany(() => UserEntity, (user) => user.projectLiked, {
    cascade: true,
  })
  @JoinTable()
  likes: UserEntity[];

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  liked?: UserEntity;
}

function addYears(date, years) {
  const dateCopy = new Date(date);
  dateCopy.setFullYear(dateCopy.getFullYear() + years);
  return dateCopy;
}
