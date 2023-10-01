import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, NotContains } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    example: 'email@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @NotContains(' ')
  readonly email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly password: string;
}
