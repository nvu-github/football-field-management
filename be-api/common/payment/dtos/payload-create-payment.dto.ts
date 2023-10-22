import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, NotContains } from 'class-validator';

export class PayloadCreatePaymentDto {
  @ApiProperty({
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @ApiProperty({
    example: 'NCB',
  })
  @IsString()
  @IsNotEmpty()
  readonly bankCode: String;
}
