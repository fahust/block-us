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
      .leftJoin('user.projects', 'projects')
      .leftJoin('user.invests', 'invests', null, { limit: 10 })
      .leftJoin('invests.project', 'investProject')
      .leftJoin('user.votes', 'votes', null, { limit: 10 })
      .leftJoin('user.comments', 'comments', null, { limit: 10 })
      .select([
        'user.id',
        'projects.id',
        'projects.title',
        'projects.walletAddressToken',
        'projects.walletAddressProxy',
        'invests.id',
        'invests.hash',
        'invests.value',
        'invests.chainId',
        'invests.created_at',
        'investProject.id',
        'investProject.title',
        'investProject.walletAddressToken',
        'investProject.walletAddressProxy',
      ])
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
