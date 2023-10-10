import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { EFootballPitchStatus } from '../enum';

export class ParamFootballPitchDto {
  @ApiProperty({
    example: 'Sân bóng số 1',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 'Mô tả sân bóng',
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    example: EFootballPitchStatus.EMPTY,
  })
  @IsString()
  @IsNotEmpty()
  readonly status: EFootballPitchStatus;

  @ApiProperty({
    example: ['image1', 'image2'],
  })
  @IsString()
  @IsNotEmpty()
  images: string[];

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly typeId: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly staffId: number;
}
