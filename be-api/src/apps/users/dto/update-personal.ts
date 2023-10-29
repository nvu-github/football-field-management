import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  NotContains,
} from 'class-validator';

export class UpdatePersonalDto {
  @ApiProperty({
    example: 'John wick',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'Team 1',
  })
  @IsString()
  @IsOptional()
  readonly teamName: string;

  @ApiProperty({
    example: '0312341231',
  })
  @IsString()
  @IsNotEmpty()
  readonly phoneNumber: string;

  @ApiProperty({
    example: '2023-10-28T17:22:33.274Z',
  })
  @IsDateString()
  @IsOptional()
  readonly dateOfBirth: string;

  @ApiProperty({
    example: 'Ha Noi',
  })
  @IsString()
  @IsOptional()
  readonly address: string;

  @ApiProperty({
    example: 'MALE',
  })
  @IsString()
  @IsOptional()
  readonly gender: string;

  @ApiProperty({
    example: 'uploads/avatar/user1.png',
  })
  @IsString()
  @IsOptional()
  readonly avatar: string;
}
