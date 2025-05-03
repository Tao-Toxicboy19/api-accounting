import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Installment, InstallmentDocument } from './schema';
import {
  CreateInstallmentDto,
  DeleteInstallmentByUserDto,
  LabelValueDto,
} from './dto';

@Injectable()
export class InstallmentService {
  constructor(
    @InjectModel(Installment.name)
    private readonly model: Model<InstallmentDocument>,
  ) {}

  async create(dto: CreateInstallmentDto): Promise<Installment> {
    const installment = new this.model({
      ...dto,
      startDate: new Date(dto.startDate),
    });
    return installment.save();
  }

  async getDropdownOptions(userId: string): Promise<LabelValueDto[]> {
    const installments = await this.model
      .find({ user: userId, deletedAt: null })
      .select('name _id')
      .exec();

    return installments.map(({ _id, name }) => ({
      label: name,
      value: _id as string,
    }));
  }

  async getUserInstallments(userId: string): Promise<Installment[]> {
    return this.model
      .find({ user: userId, deletedAt: null })
      .select('-createdAt -updatedAt -__v')
      .sort({ date: 1 })
      .exec();
  }

  async incrementPaidMonth(
    installmentId: string,
    userId: string,
    amount: number,
  ): Promise<void> {
    await this.model.updateOne(
      {
        _id: installmentId,
        user: userId,
        deletedAt: { $exists: false },
      },
      {
        $inc: { paidMonths: 1, totalPrice: amount },
      },
    );
  }

  async softDeleteByUser(dto: DeleteInstallmentByUserDto): Promise<void> {
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
      throw new NotFoundException('Installment not found or already deleted.');
    }
  }
}
