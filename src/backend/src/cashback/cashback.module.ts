
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashbackTransaction } from './entities/cashback-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CashbackTransaction])],
  exports: [TypeOrmModule],
})
export class CashbackModule {}
