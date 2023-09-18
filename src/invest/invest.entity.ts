import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/helpers/entity/base.entity';
import { ProjectEntity } from 'src/project/project.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class InvestEntity extends BaseEntity {

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @Column()
  @ManyToOne(() => ProjectEntity, (project) => project.comments, {
    orphanedRowAction: 'soft-delete',
  })
  project: ProjectEntity;
}
