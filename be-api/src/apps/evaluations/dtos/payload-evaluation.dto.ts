import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PayloadEvaluationDto {
  @ApiProperty({
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly score: number;

  @ApiProperty({
    example: 'content',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty({
    example: JSON.stringify({ url: 'upload/image1.png' }),
  })
  @IsArray()
  @IsOptional()
  image: JSON;

  @IsNumber()
  readonly customerId: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly footballPitchId: number;
}
