import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  NotEquals,
} from 'class-validator';
import { BaseEntity } from 'src/helper/entity/base.entity';
import { ChainId } from 'src/helper/enum/network.enum';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique('vote_hash_index', ['hash', 'chainId'])
export class VoteEntity extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column({ select: false })
  hash: string;

  @ApiProperty()
  @IsNumber()
  @NotEquals(0)
  @Column({ select: false })
  value: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Column({ default: false, select: false })
  validation: boolean;

  @ApiProperty()
  @IsEnum(ChainId)
  @Column({ select: false })
  chainId: ChainId;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToOne(() => ProjectEntity, (project) => project.votes)
  project: ProjectEntity;

  @ApiPropertyOptional({ type: 'object' })
  @IsOptional()
  @ManyToOne(() => UserEntity, (user) => user.votes)
  owner: UserEntity;
}
