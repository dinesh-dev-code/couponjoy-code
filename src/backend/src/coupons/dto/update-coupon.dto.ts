
import { PartialType } from '@nestjs/swagger';
import { CreateCouponDto } from './create-coupon.dto';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  // Extended from CreateCouponDto via PartialType
  // This makes all properties from CreateCouponDto optional
  // Properties like storeId and categoryIds are inherited
}
