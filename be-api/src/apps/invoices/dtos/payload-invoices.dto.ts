import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  NotContains,
  IsOptional,
  IsArray,
} from 'class-validator';

export class PayloadInvoiceDto {
  @ApiProperty({
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly totalPrice: number;

  @ApiProperty({
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  readonly moneyPaid: number;

  @ApiProperty({
    example: 'UNPAID',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly status: string;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly staffId: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly invoiceTypeId: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  readonly customerFootballId: number;

  @ApiProperty({
    example: [
      {
        price: 10000,
        amount: 10,
        finalCost: 20000,
        accessoryId: 1,
      },
      {
        price: 10000,
        amount: 10,
        finalCost: 20000,
        accessoryId: 1,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  invoiceDetails?: Array<{
    price: number;
    amount: number;
    finalCost: number;
    accessoryId: number;
  }>;
}
