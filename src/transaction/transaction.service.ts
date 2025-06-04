import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CreateTransactionDto,
  CreateTransactionWithInstallmentDto,
  DeleteTransactionByUserDto,
  FindTransactionByUserDto,
  UpdateTransactionDto,
} from './dto';
import { Transaction, TransactionDocument } from './schema';
import { InstallmentService } from '../installment/installment.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly model: Model<TransactionDocument>,
    private readonly installmentService: InstallmentService,
  ) {}

  async create(dto: CreateTransactionWithInstallmentDto): Promise<Transaction> {
    if (dto.type === 'installment' && dto.installmentId) {
      const { name } = await this.installmentService.incrementPaidMonth(
        dto.installmentId,
        dto.user,
        dto.amount,
      );
      dto.title = name;
    } else if (dto.type === 'saving') {
      if (!dto.savingGoalId) throw new BadRequestException(`Request Saving ID`);
      dto.savingGoalId = new Types.ObjectId(dto.savingGoalId);
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

  async findAllByUser({
    user,
    page = 1,
    limit = 20,
  }: FindTransactionByUserDto): Promise<{
    items: Transaction[];
    total: number;
    totalPage: number;
  }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model
        .find({
          user,
          $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
        })
        .select('-createdAt -updatedAt -__v')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.model.countDocuments({ user, deletedAt: null }),
    ]);
    const totalPage = Math.ceil(total / limit);

    return { items, total, totalPage };
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

  async getIncomeAndExpenseSum(
    userId: string,
  ): Promise<{ income: number; expense: number }> {
    const startOfMonth = dayjs()
      .utc()
      .subtract(1, 'month')
      .date(28)
      .startOf('day')
      .toDate();
    const today = new Date();

    const [result] = await this.model.aggregate([
      {
        $match: {
          user: userId,
          type: { $in: ['income', 'expense', 'installment'] },
          deletedAt: null,
          date: { $gte: startOfMonth, $lte: today },
        },
      },
      {
        $group: {
          _id: null,
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [
                { $in: ['$type', ['expense', 'installment']] },
                '$amount',
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          income: 1,
          expense: 1,
        },
      },
    ]);

    return result || { income: 0, expense: 0 };
  }

  async updateTransaction(dto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.model.findOneAndUpdate(
      { _id: dto.id, deletedAt: { $exists: false } },
      { $set: dto },
      { new: true },
    );

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }
}
