import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, NotContains } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'John Smith',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'Team 1',
  })
  @IsString()
  @IsNotEmpty()
  readonly teamName: string;

  @ApiProperty({
    example: 'email@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @NotContains(' ')
  readonly email: string;

  @ApiProperty({
    example: '0987654321',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly phoneNumber: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly password: string;
}
