import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'my username' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'my password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'my official name' })
  @IsString()
  lastName: string;
}

export class SignInDto {
  @ApiProperty({ example: 'my username' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'my password' })
  @IsString()
  password: string;
}
