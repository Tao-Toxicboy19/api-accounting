import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateTransactionDto,
  DeteleTransactionByUser,
  CreateTransactionWithInstallmentDto,
} from './dto';
import { Transaction, TransactionDocument } from './schema';
import { InstallmentService } from '../installment/installment.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private installmentService: InstallmentService,
  ) {}

  async create(dto: CreateTransactionWithInstallmentDto): Promise<Transaction> {
    if (dto.type === 'installment' && dto.installmentId) {
      await this.installmentService.updatePaidMonth(
        dto.installmentId,
        dto.user,
        dto.amount,
      );
    }
    return await this.createTransaction(dto);
  }

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    return await new this.transactionModel({
      ...dto,
      date: new Date(dto.date),
    }).save();
  }

  async findByUser(userId: string): Promise<Transaction[]> {
    return await this.transactionModel
      .find({ user: userId, deletedAt: null })
      .select('-createdAt -updatedAt -__v')
      .sort({ date: 1 })
      .exec();
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
