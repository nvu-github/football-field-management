import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PayloadInvoiceTypeDto {
  @ApiProperty({
    example: 'Invoice type name',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
