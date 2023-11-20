import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestEntity } from './invest.entity';

@Injectable()
export class InvestService {
  constructor(
    @InjectRepository(InvestEntity)
    private investRepository: Repository<InvestEntity>,
  ) {}

  async invest(id: number): Promise<InvestEntity> {
    return this.investRepository
      .createQueryBuilder('invest')
      .where('invest.id = :id', { id })
      .getOne();
  }

  async detail(id: number): Promise<InvestEntity> {
    return this.investRepository
      .createQueryBuilder('invest')
      .where('invest.id = :id', { id })
      .getOne();
  }

  async save(invest: InvestEntity): Promise<InvestEntity> {
    return this.investRepository.save(invest);
  }
}
