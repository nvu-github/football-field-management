import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PayloadAccessoryTypeDto {
  @ApiProperty({
    example: 'Phụ kiện thuê',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
