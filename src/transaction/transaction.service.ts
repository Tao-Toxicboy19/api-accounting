import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateTransactionDto,
  CreateTransactionWithInstallmentDto,
  DeleteTransactionByUserDto,
} from './dto';
import { Transaction, TransactionDocument } from './schema';
import { InstallmentService } from '../installment/installment.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly model: Model<TransactionDocument>,
    private readonly installmentService: InstallmentService,
  ) {}

  async create(dto: CreateTransactionWithInstallmentDto): Promise<Transaction> {
    if (dto.type === 'installment' && dto.installmentId) {
      await this.installmentService.incrementPaidMonth(
        dto.installmentId,
        dto.user,
        dto.amount,
      );
    }
    return this.saveTransaction(dto);
  }

  private async saveTransaction(
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = new this.model({
      ...dto,
      date: new Date(dto.date),
    });
    return transaction.save();
  }

  async findAllByUser(userId: string): Promise<Transaction[]> {
    return this.model
      .find({ user: userId, deletedAt: null })
      .select('-createdAt -updatedAt -__v')
      .sort({ date: 1 })
      .exec();
  }

  async softDeleteByUser(dto: DeleteTransactionByUserDto): Promise<void> {
    const result = await this.model.updateOne(
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
