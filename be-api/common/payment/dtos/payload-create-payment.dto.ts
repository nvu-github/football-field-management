import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PayloadCreatePaymentDto {
  @ApiProperty({
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  // @ApiProperty({
  //   example: 'NCB',
  // })
  // @IsString()
  // @IsOptional()
  // readonly bankCode: String;
}
