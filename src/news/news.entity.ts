import { ApiProperty } from '@nestjs/swagger';
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
export class NewsEntity extends BaseEntity {

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  content: string;
}
