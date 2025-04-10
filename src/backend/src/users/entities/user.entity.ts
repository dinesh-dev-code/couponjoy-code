
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { SavedCoupon } from './saved-coupon.entity';
import { CashbackTransaction } from '../../cashback/entities/cashback-transaction.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column('jsonb', {
    default: {
      categories: [],
      stores: [],
      notifications: {
        email: true,
        push: true,
        expiry: true,
        newDeals: true,
      },
    },
  })
  preferences: {
    categories: string[];
    stores: string[];
    notifications: {
      email: boolean;
      push: boolean;
      expiry: boolean;
      newDeals: boolean;
    };
  };

  @Column({ default: 0 })
  pointsBalance: number;

  @Column({ unique: true })
  referralCode: string;

  @OneToMany(() => SavedCoupon, (savedCoupon) => savedCoupon.user)
  savedCoupons: SavedCoupon[];

  @OneToMany(
    () => CashbackTransaction,
    (cashbackTransaction) => cashbackTransaction.user,
  )
  cashbackTransactions: CashbackTransaction[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
