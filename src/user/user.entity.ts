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
export class UserEntity extends BaseEntity  {

  @ApiProperty()
  @MinLength(42)
  @MaxLength(42)
  @Column()
  address: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  lastName: string;
}
