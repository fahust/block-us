import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEthereumAddress, IsString } from 'class-validator';

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

  @ApiProperty({ example: '0x2b4d87eff06f22798c30dc4407c7d83429aaa9abc' })
  @IsEthereumAddress()
  address: string;

  @ApiProperty({ example: 'lulu@hotmail.fr' })
  @IsEmail()
  email: string;
}

export class SignInDto {
  @ApiProperty({ example: 'my username' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'my password' })
  @IsString()
  password: string;
}
