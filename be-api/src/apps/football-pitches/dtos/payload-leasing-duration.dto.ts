import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class PayloadLeasingDurationDto {
  @ApiProperty({
    example: '10:00',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly startTime: string;

  @ApiProperty({
    example: '11:30',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly endTime: string;
}
