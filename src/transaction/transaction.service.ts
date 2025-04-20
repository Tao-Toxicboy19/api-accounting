import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schema/transaction.schema';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const created = new this.transactionModel({
      ...dto,
      date: new Date(dto.date),
    });
    return await created.save();
  }

  async findByUser(userId: string): Promise<Transaction[]> {
    const transactions = await this.transactionModel
      .find({ user: userId })
      .exec();

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException('No transactions found');
    }

    return transactions;
  }
}
