import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, NotContains } from 'class-validator';

import { EGender } from '../enum';
export class StaffDto {
  @ApiProperty({
    example: 'John wick'
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: '0981235123'
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly phoneNumber: string;

  @ApiProperty({
    example: '2023-10-03T07:11:05.332Z'
  })
  @IsDateString()
  @IsNotEmpty()
  readonly dateOfBirth: string;

  @ApiProperty({
    example: 'Mieu Dam street, Nam Tu Liem, Ha Noi'
  })
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty({
    example: EGender.OTHER
  })
  @IsString()
  @IsNotEmpty()
  readonly gender: EGender

  @ApiProperty({
    example: 'avatar.png'
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly avatar?: string
}
