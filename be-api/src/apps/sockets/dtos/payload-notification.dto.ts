import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PayloadNotificationDto {
  @ApiProperty({
    example: 'Title',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    example: 'Content',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty({
    example: 'REQUEST',
  })
  @IsString()
  @IsNotEmpty()
  readonly status: string;
}
