
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { SavedCoupon } from './entities/saved-coupon.entity';
import { Coupon } from '../coupons/entities/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SavedCoupon, Coupon])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
