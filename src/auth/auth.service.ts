import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SignInPresenter } from './auth.presenter';
import { SignInDto, SignUpDto } from './auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private saltOrRounds: number;

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.saltOrRounds = this.configService.get<number>('SALT_PASSWORD');
  }

  async signIn(signInDto: SignInDto): Promise<SignInPresenter> {
    const { name, password } = signInDto;

    const user = await this.userRepository.findOneBy({ name });
    if (!user) throw new UnauthorizedException('User not exist');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password dont match');

    const payload = { name, id: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signInDto: SignUpDto): Promise<UpdateResult> {
    const { name, password, lastName } = signInDto;
    const user = await this.userRepository.findOneBy({ name });
    if (user) throw new UnauthorizedException('Already exist');
    const hash = bcrypt.hashSync(password, +this.saltOrRounds);
    return this.userRepository.insert({ name, password: hash, lastName });
  }
}
