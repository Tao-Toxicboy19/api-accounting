import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schema/transaction.schema';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DeteleTransactionByUser } from './dto/delete-transaction-by-user.dto';

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
      .find({ user: userId, deletedAt: null })
      .select('-createdAt -updatedAt -__v')
      .exec();

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException('No transactions found');
    }

    return transactions;
  }

  async deleteByUser(dto: DeteleTransactionByUser): Promise<void> {
    const result = await this.transactionModel.updateOne(
      {
        _id: dto.id,
        user: dto.user,
        deletedAt: { $exists: false },
      },
      {
        $set: { deletedAt: new Date() },
      },
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Transaction not found or already deleted');
    }
  }
}
