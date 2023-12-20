import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEthereumAddress,
  IsNumber,
  IsOptional,
  Min,
  NotEquals,
} from 'class-validator';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class InvestEntity extends BaseEntity {
  @ApiProperty()
  @IsEthereumAddress()
  @Column({ unique: true })
  address: string;

  @ApiProperty()
  @IsNumber()
  @NotEquals(0)
  @Column()
  value: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  @Column({ default: false })
  validation: boolean;

  @ApiProperty({ type: 'object' })
  @ManyToOne(() => ProjectEntity, (project) => project.invests)
  project: Omit<ProjectEntity, 'password'>;

  @ApiProperty({ type: 'object' })
  @ManyToOne(() => UserEntity, (user) => user.invests)
  owner: UserEntity;
}
