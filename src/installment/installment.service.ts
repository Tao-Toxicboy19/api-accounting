import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Installment, InstallmentDocument } from './schema';
import { Model } from 'mongoose';
import { CreateInstallmentDto } from './dto';

@Injectable()
export class InstallmentService {
  constructor(
    @InjectModel(Installment.name)
    private installmentModel: Model<InstallmentDocument>,
  ) {}

  async createInstallment(dto: CreateInstallmentDto): Promise<{ id: string }> {
    const installment = await new this.installmentModel({
      ...dto,
      startDate: new Date(dto.startDate),
    }).save();

    return { id: installment._id as string };
  }
}
