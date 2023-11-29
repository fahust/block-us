import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsNumber, Min } from 'class-validator';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import { ProjectEntity } from 'src/project/project.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class InvestEntity extends BaseEntity {
  @ApiProperty()
  @IsEthereumAddress()
  @Column()
  address: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Column()
  value: number;

  @ApiProperty()
  @Column()
  @ManyToOne(() => ProjectEntity, (project) => project.invests)
  project: ProjectEntity;

  @ApiProperty()
  @Column()
  @ManyToOne(() => UserEntity, (user) => user.invests)
  owner: UserEntity;
}
