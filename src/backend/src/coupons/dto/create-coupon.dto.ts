
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsObject,
  IsOptional,
  IsArray,
  IsBoolean,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCouponDto {
  @ApiProperty({ example: 'Save 20% on all items' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Get 20% off on all items with this coupon code.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'SAVE20' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: {
      type: 'percentage',
      value: 20,
    },
  })
  @IsObject()
  discount: {
    type: 'percentage' | 'fixed' | 'bogo';
    value: number;
  };

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  storeId: string;

  @ApiProperty({ example: ['123e4567-e89b-12d3-a456-426614174000'] })
  @IsArray()
  @IsUUID('4', { each: true })
  categoryIds: string[];

  @ApiProperty({ example: '2023-12-31' })
  @Type(() => Date)
  @IsDate()
  expiryDate: Date;

  @ApiPropertyOptional({ example: 'Valid only for new customers' })
  @IsString()
  @IsOptional()
  terms?: string;

  @ApiPropertyOptional({ example: 'https://example.com/offer' })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  cashbackInfo?: {
    available: boolean;
    value: number;
    type: 'percentage' | 'fixed';
  };
}
