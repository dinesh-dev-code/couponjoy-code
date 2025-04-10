
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  logo: string;

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'store_categories',
    joinColumn: { name: 'store_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @Column({ default: 0 })
  couponCount: number;

  @Column({ default: false })
  isPopular: boolean;

  @Column()
  website: string;

  @OneToMany(() => Coupon, (coupon) => coupon.store)
  coupons: Coupon[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
