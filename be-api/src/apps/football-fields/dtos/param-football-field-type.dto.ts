import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class ParamFootbalFieldType {
  @ApiProperty({
    example: 'Sân 7'
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
