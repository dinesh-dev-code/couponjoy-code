
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  code: string;

  @Column('jsonb')
  discount: {
    type: 'percentage' | 'fixed' | 'bogo';
    value: number;
  };

  @ManyToOne(() => Store, (store) => store.coupons)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'coupon_categories',
    joinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @Column('timestamp')
  expiryDate: Date;

  @Column('text', { nullable: true })
  terms: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column('float', { default: 0 })
  successRate: number;

  @Column({ nullable: true })
  url: string;

  @Column({ default: 0 })
  usedCount: number;

  @Column({ default: false })
  isPopular: boolean;

  @Column({ default: false })
  isNew: boolean;

  @Column('jsonb', { nullable: true })
  cashbackInfo: {
    available: boolean;
    value: number;
    type: 'percentage' | 'fixed';
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  isExpiringSoon: boolean;
}
