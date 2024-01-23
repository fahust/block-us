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
  @Column()
  walletAddressToken: string;

  @ApiProperty()
  @IsEthereumAddress()
  @Column()
  walletAddressProxy: string;

  @ApiProperty()
  @IsString()
  @Column()
  hashToken: string;

  @ApiProperty()
  @IsString()
  @Column()
  hashProxy: string;

  @ApiProperty()
  @IsEnum(ChainId)
  @Column()
  chainId: ChainId;

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
  @MaxLength(10000)
  @Column()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(256)
  @Column()
  shortDescription: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Column()
  mainCategory: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
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

  @ApiProperty()
  @IsBoolean()
  @Column()
  pausable: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column()
  rulesModifiable: boolean;

  @ApiProperty()
  @IsBoolean()
  @Column()
  voteToWithdraw: boolean;

  @ApiProperty()
  @IsNumber()
  @Column()
  dayToWithdraw: number;

  @ApiProperty()
  @IsDate()
  @MinDate(new Date())
  @MaxDate(addYears(new Date(), 1))
  @Column()
  startFundraising: Date;

  @ApiProperty()
  @IsNumber()
  @MinDate(new Date())
  @MaxDate(addYears(new Date(), 1))
  @Column()
  endFundraising: Date;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(1000000000)
  @Column()
  maxSupply: number;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @OneToMany(() => CommentEntity, (comment) => comment.project, {
    cascade: true,
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
