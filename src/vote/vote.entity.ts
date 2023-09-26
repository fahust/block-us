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
  @Column()
  hash: string;

  @ApiProperty()
  @IsNumber()
  @NotEquals(0)
  @Column()
  value: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  @Column({ default: false })
  validation: boolean;

  @ApiProperty()
  @IsEnum(ChainId)
  @Column()
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
