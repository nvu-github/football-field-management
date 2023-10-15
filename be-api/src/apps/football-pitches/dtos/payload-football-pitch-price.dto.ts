import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PayloadFootballPitchPriceDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly footballPitchId: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly leasingDurationId: number;

  @ApiProperty({
    example: 50000,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;
}
