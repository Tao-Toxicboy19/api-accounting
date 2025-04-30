import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Installment, InstallmentDocument } from './schema';
import { Model } from 'mongoose';
import { CreateInstallmentDto, LabelValueDto } from './dto';

@Injectable()
export class InstallmentService {
  constructor(
    @InjectModel(Installment.name)
    private installmentModel: Model<InstallmentDocument>,
  ) {}

  async createInstallment(dto: CreateInstallmentDto): Promise<Installment> {
    return await new this.installmentModel({
      ...dto,
      startDate: new Date(dto.startDate),
    }).save();
  }

  async findInstallmentByUser(userId: string): Promise<LabelValueDto[]> {
    const installments = await this.installmentModel
      .find({ user: userId, deletedAt: null })
      .select('name _id')
      .exec();
    return installments.map((i) => ({
      label: i.name,
      value: i._id as string,
    }));
  }

  async updatePaidMonth(
    id: string,
    user: string,
    price: number,
  ): Promise<void> {
    await this.installmentModel.updateOne(
      {
        _id: id,
        user: user,
        deletedAt: { $exists: false },
      },
      {
        $inc: { paidMonths: 1, totalPrice: price },
      },
    );
  }
}
