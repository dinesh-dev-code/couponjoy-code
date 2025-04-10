
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('cashback_transactions')
export class CashbackTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.cashbackTransactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  couponId: string;

  @Column()
  storeId: string;

  @Column('decimal')
  amount: number;

  @Column()
  status: 'pending' | 'approved' | 'rejected' | 'paid';

  @CreateDateColumn()
  transactionDate: Date;

  @Column('timestamp', { nullable: true })
  payoutDate: Date;
}
