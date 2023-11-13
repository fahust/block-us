import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class ProjectEntity extends BaseEntity {

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  password: string;
}
