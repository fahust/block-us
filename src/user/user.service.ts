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
    const account = await this.userRepository
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

    const invests = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoin('user.invests', 'invests')
      .select('SUM(invests.value)', 'investSum')
      .addSelect('AVG(invests.value)', 'investAvg')
      .addSelect('MAX(invests.value)', 'investMax')
      .addSelect('MIN(invests.value)', 'investMin')
      .getRawOne();

    return { ...account, ...invests };
  }

  async getMyInvests(id: number): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoin('user.invests', 'invests')
      .select([
        'user.id',
        'invests.id',
        'invests.hash',
        'invests.value',
        'invests.chainId',
        'invests.created_at',
      ])
      .getOne();
  }

  async getMyProjects(id: number): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoin('user.projects', 'projects')
      .leftJoin('user.invests', 'usersInvests')
      .leftJoin('usersInvests.project', 'projectInvests')
      .select([
        'user.id',
        'projects.id',
        'projects.title',
        'projects.walletAddressToken',
        'projects.walletAddressProxy',
        'projectInvests.id',
        'projectInvests.title',
        'projectInvests.walletAddressToken',
        'projectInvests.walletAddressProxy',
      ])
      .addSelect('SUM(projectInvests.value)', 'totalValue')
      .getOne();
  }

  async getMyComments(id: number): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoin('user.comments', 'comments')
      .select([
        'user.id',
        'comments.id',
        'comments.title',
        'comments.content',
        'comments.created_at',
      ])
      .getOne();
  }

  async getMyVotes(id: number): Promise<UserEntity> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .leftJoin('user.votes', 'votes')
      .select([
        'user.id',
        'vote.id',
        'vote.value',
        'vote.hash',
        'vote.created_at',
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
