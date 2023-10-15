import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { EFootballPitchStatus } from '../enum';

interface Image {
  url: string;
}

export class PayloadFootballPitchDto {
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
  @IsOptional()
  readonly description: string;

  @ApiProperty({
    example: EFootballPitchStatus.EMPTY,
  })
  @IsString()
  @IsNotEmpty()
  readonly status: EFootballPitchStatus;

  @ApiProperty({
    example: [{ url: 'upload/image1.png' }, { url: 'upload/image2.png' }],
  })
  @IsArray()
  @IsOptional()
  images: Array<Image>[];

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly footballTypeId: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly staffId: number;
}
