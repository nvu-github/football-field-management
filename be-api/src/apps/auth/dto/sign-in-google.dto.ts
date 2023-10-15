import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class SignInGoogleDto {
  @ApiProperty({
    example: 'idToken',
  })
  @IsString()
  @IsNotEmpty()
  @NotContains(' ')
  readonly idToken: string;
}
