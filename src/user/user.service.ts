import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async get(id: number): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async getMyAccount(id: number): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoinAndSelect('user.projects', 'projects')
      .leftJoinAndSelect('user.invests', 'invests', null, { limit: 10 })
      .leftJoinAndSelect('user.votes', 'votes', null, { limit: 10 })
      .leftJoinAndSelect('user.comments', 'comments', null, { limit: 10 })
      .getOne();
  }

  async findByAddress(walletAddress: string): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.walletAddress = :walletAddress', { walletAddress })
      .getOne();
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }
}
