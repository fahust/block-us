import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { Request as RequestExpress } from 'express';
import { ethers } from 'ethers';
import { ApiTags } from '@nestjs/swagger';
import { AuthRefreshJwtGuard } from 'src/authentication/decorator/authentication.decorator';
import { AuthenticationChallengeResponseDTO } from 'src/authentication/dto/authentication-challenge-response.dto';
import { AuthenticationRequestDTO } from 'src/authentication/dto/authentication-request.dto';
import { AuthenticationResponseDTO } from 'src/authentication/dto/authentication-response.dto';
import { AuthenticationService } from 'src/authentication/service/authentication.service';
import { AuthenticationChallengeRequestDTO } from 'src/authentication/dto/authentication-challenge-request.dto';

@Controller({
  version: '1',
  path: 'authentication',
})
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('/challenge')
  async challenge(
    @Body()
    authenticationChallengeRequest: AuthenticationChallengeRequestDTO,
  ): Promise<AuthenticationChallengeResponseDTO> {
    return this.authenticationService.challenge(authenticationChallengeRequest);
  }

  @Post('/')
  async authenticate(
    @Body() authenticationRequest: AuthenticationRequestDTO,
  ): Promise<AuthenticationResponseDTO> {
    return this.authenticationService.authentication(authenticationRequest);
  }

  @Get('/refresh')
  @AuthRefreshJwtGuard()
  async refreshToken(@Request() req): Promise<AuthenticationResponseDTO> {
    return this.authenticationService.refreshToken(
      this.extractJwtFromRequest(req),
      req.user,
    );
  }

  extractJwtFromRequest(req: RequestExpress): string {
    return req.headers.authorization.substring('Bearer '.length);
  }

  @Get('/create-user')
  async get(): Promise<any> {
    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;

    const challengePayload = {
      walletAddress,
    };

    const { challenge } = await this.authenticationService.challenge(
      challengePayload,
    );

    const signature = await wallet.signMessage(challenge);

    const authenticationPayload = {
      walletAddress,
      signature,
    };

    const result = await this.authenticationService.authentication(
      authenticationPayload,
    );

    return result;
  }
}
