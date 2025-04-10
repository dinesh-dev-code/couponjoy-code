
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SocialLoginDto {
  @ApiProperty({ description: 'Social provider (google, facebook, apple)' })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ description: 'Authentication token from the provider' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
