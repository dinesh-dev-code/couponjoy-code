
import { PartialType } from '@nestjs/swagger';
import { CreateCouponDto } from './create-coupon.dto';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  // These properties are explicitly added to fix TypeScript errors
  storeId?: string;
  categoryIds?: string[];
}
