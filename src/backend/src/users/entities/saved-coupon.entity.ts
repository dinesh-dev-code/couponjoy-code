
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';

@Entity('saved_coupons')
@Unique(['user', 'coupon'])
export class SavedCoupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.savedCoupons)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Coupon)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @CreateDateColumn()
  createdAt: Date;
}
