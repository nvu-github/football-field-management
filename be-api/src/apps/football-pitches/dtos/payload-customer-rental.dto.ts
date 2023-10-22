import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class PayloadCustomerRentalDto {
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
    example: '2023-10-21T08:11:14.462Z',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly rentalDate: string;

  @ApiProperty({
    example: [
      {
        customerFootballPitchRentalId: 1,
        accessoryId: 1,
        amount: 10,
      },
      {
        customerFootballPitchRentalId: 2,
        accessoryId: 2,
        amount: 10,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  customerAccessoryRentals: Array<{
    customerFootballPitchRentalId: number;
    accessoryId: number;
    amount: number;
  }>;
}
