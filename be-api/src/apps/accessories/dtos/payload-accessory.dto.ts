import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

interface Image {
  url: string;
}

export class PayloadAccessoryDto {
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
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @ApiProperty({
    example: 10.000,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

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
  readonly accessoryTypeId: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly staffId: number;
}
