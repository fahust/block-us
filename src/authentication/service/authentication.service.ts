import { SHA256 } from 'crypto-js';
import { ethers } from 'ethers';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationChallengeRequestDTO } from 'src/authentication/dto/authentication-challenge-request.dto';
import { AuthenticationChallengeResponseDTO } from 'src/authentication/dto/authentication-challenge-response.dto';
import { AuthenticationRequestDTO } from 'src/authentication/dto/authentication-request.dto';
import { AuthenticationResponseDTO } from 'src/authentication/dto/authentication-response.dto';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { HelperDateService } from 'src/helper/service/helper.date.service';
import { HelperHashService } from 'src/helper/service/helper.hash.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthenticationService {
  private readonly accessTokenSecretToken: string;
  private readonly accessTokenExpirationTime: string;

  private readonly refreshTokenSecretToken: string;
  private readonly refreshTokenExpirationTime: string;
  private readonly refreshTokenNotBeforeExpirationTime: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly helperDateService: HelperDateService,
    private readonly helperHashService: HelperHashService,
    private readonly userService: UserService,
    private jwt: JwtService,
  ) {
    this.accessTokenSecretToken = this.configService.get('SECRET_KEY');
    this.accessTokenExpirationTime = this.configService.get(
      'TOKEN_EXPIRATION_TIME',
    );

    this.refreshTokenSecretToken = this.configService.get('SECRET_KEY');
    this.refreshTokenExpirationTime = this.configService.get(
      'TOKEN_EXPIRATION_TIME',
    );
    this.refreshTokenNotBeforeExpirationTime =
      this.configService.get('SECRET_KEY');
  }

  nonceCacheKey(walletAddress: string): string {
    return `${walletAddress}:nonce`;
  }

  jwtCacheKey(walletAddress: string): string {
    return `${walletAddress}:jwt`;
  }

  async createAccessToken(payload: Record<string, any>): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.accessTokenSecretToken,
      expiresIn: this.accessTokenExpirationTime,
    });
  }

  async isValidAccessToken(token: string): Promise<boolean> {
    const jwt: unknown = await this.jwt.verifyAsync(token, {
      secret: this.accessTokenSecretToken,
    });

    return jwt !== null;
  }

  async createRefreshToken(payload: any, test?: boolean): Promise<string> {
    return this.jwt.sign(payload, {
      secret: this.refreshTokenSecretToken,
      expiresIn: this.refreshTokenExpirationTime,
      notBefore: test ? '0' : this.refreshTokenNotBeforeExpirationTime,
    });
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    const jwt: unknown = await this.jwt.verifyAsync(token, {
      secret: this.refreshTokenSecretToken,
    });

    return jwt !== null;
  }

  verifyWeb3Signature(
    challenge: string,
    signature: string,
    walletAddress: string,
  ): boolean {
    if (!signature.match(/^0x([A-Fa-f0-9]{130})$/)) {
      return false;
    }

    const recoveredWallet = ethers.verifyMessage(challenge, signature);
    return recoveredWallet === walletAddress;
  }

  async challengeMessage(
    walletAddress: string,
    nonce: string,
  ): Promise<string> {
    return `Welcome to block us!\nClick to sign in and accept the warlock \nThis request will not trigger a blockchain transaction or cost any gas fees.\nYour authentication status will reset after 24 hours.\nWallet address:\n${walletAddress}\nNonce:\n${nonce}`;
  }

  async cacheNonce(walletAddress: string): Promise<string> {
    const nonce = this.helperHashService.uuid(4);

    await this.cacheManager.set(
      this.nonceCacheKey(walletAddress),
      nonce,
      600000,
    );

    return nonce;
  }

  async getCachedNonce(walletAddress: string): Promise<string> {
    return this.cacheManager.get(this.nonceCacheKey(walletAddress));
  }

  async cacheRefreshTokenHash(walletAddress: string, refreshJwt: string) {
    const hash = SHA256(refreshJwt).toString();

    await this.cacheManager.set(this.jwtCacheKey(walletAddress), hash, 600000);

    return hash;
  }

  async getCachedRefreshTokenHash(walletAddress: string): Promise<string> {
    return this.cacheManager.get(this.jwtCacheKey(walletAddress));
  }

  async deleteCachedRefreshTokenHash(walletAddress: string): Promise<void> {
    await this.cacheManager.del(this.jwtCacheKey(walletAddress));
  }

  async challenge(
    authenticationChallengeRequest: AuthenticationChallengeRequestDTO,
  ): Promise<AuthenticationChallengeResponseDTO> {
    const { walletAddress } = authenticationChallengeRequest;

    const nonce = await this.cacheNonce(walletAddress);

    const challenge = await this.challengeMessage(walletAddress, nonce);

    return {
      challenge,
      nonce,
    };
  }

  async authentication(
    authenticationRequest: AuthenticationRequestDTO,
  ): Promise<AuthenticationResponseDTO> {
    const { walletAddress, signature } = authenticationRequest;

    const nonce = await this.getCachedNonce(walletAddress);

    const challenge = await this.challengeMessage(walletAddress, nonce);

    if (
      this.verifyWeb3Signature(challenge, signature, walletAddress) !== true
    ) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'authentication.web3.error.invalidWeb3Signature',
      });
    }

    let user = await this.userService.findByAddress(walletAddress);

    if (!user) {
      let newUser = new UserEntity();
      newUser.walletAddress = walletAddress;
      user = await this.userService.save(newUser);
    }

    const accessJwt = await this.createAccessToken({ id: user.id });

    const refreshJwt = await this.createRefreshToken({ id: user.id }, true);

    await this.cacheRefreshTokenHash(walletAddress, refreshJwt);

    return { accessJwt, refreshJwt };
  }

  async refreshToken(
    currentRefreshJwt: string,
    user: UserEntity,
  ): Promise<AuthenticationResponseDTO> {
    const currentRefreshJwtHash = SHA256(currentRefreshJwt).toString();

    const previousRefreshJwtHash = await this.getCachedRefreshTokenHash(
      user.walletAddress,
    );

    if (!previousRefreshJwtHash) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'authentication.web3.error.refreshTokenNotFoundInCache',
      });
    }

    if (currentRefreshJwtHash !== previousRefreshJwtHash) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'authentication.web3.error.invalidRefreshTokenHash',
      });
    }

    const userId = user.id;

    const accessJwt = await this.createAccessToken({
      sub: userId,
    });

    const refreshJwt = await this.createRefreshToken({ sub: userId }, true);

    await this.cacheRefreshTokenHash(user.walletAddress, refreshJwt);

    return { accessJwt, refreshJwt };
  }
}
