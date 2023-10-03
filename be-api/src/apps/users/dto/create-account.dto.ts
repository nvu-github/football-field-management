import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, NotContains } from 'class-validator';

import { ERole } from '../enum/role.enum';

export class CreateAccountDto {
  @ApiProperty({
    example: 'user@gmail.com'
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @NotContains(' ')
  readonly email: string;

  @ApiProperty({
    example: '123456'
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly password: string;

  @ApiProperty({
    example: ERole.ACCOUNTANT
  })
  @IsNumber()
  @IsNotEmpty()
  readonly roleId: ERole;
}
