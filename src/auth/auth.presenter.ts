import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInPresenter {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjo0LCJpYXQiOjE2ODY1OTA5ODcsImV4cCI6MTY4NjU5MTU4N30.agPNt6N-S1-esILMW4pDLKWo...',
  })
  @IsString()
  access_token: string;
}
