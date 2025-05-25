import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SavingGoal, SavingGoalDocument } from './schema';
import { Model, Types } from 'mongoose';
import {
  FindSavingByUserDto,
  SavingGoalDto,
  UpdateSavingGoalStatusDto,
  UserWithIdDto,
} from './dto';

@Injectable()
export class SavingGoalService {
  constructor(
    @InjectModel(SavingGoal.name)
    private readonly model: Model<SavingGoalDocument>,
  ) {}

  async createSavingGoal(dto: SavingGoalDto): Promise<SavingGoal> {
    return await this.createSavingGoal(dto);
  }

  async saveSavingGoal(dto: SavingGoalDto): Promise<SavingGoal> {
    return await this.model.create(dto);
  }

  async updateStatus(dto: UpdateSavingGoalStatusDto): Promise<SavingGoal> {
    if (!Types.ObjectId.isValid(dto.id)) {
      throw new BadRequestException(`Invalid goal ID`);
    }

    const updated = await this.model.findOneAndUpdate(
      { _id: dto.id, user: dto.user },
      { status: dto.status },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Saving not found');
    }

    return updated;
  }

  async findAllByUser({
    user,
    page = 1,
    limit = 20,
  }: FindSavingByUserDto): Promise<{
    items: SavingGoal[];
    total: number;
    totalPage: number;
  }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model
        .find({ user, deletedAt: null })
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

  async findOneByUser(dto: UserWithIdDto): Promise<SavingGoal> {
    if (!Types.ObjectId.isValid(dto.id)) {
      throw new BadRequestException(`Invalid goal ID`);
    }

    const goal = await this.model
      .findOne({ _id: dto.id, user: dto.user })
      .populate('transactions');

    if (!goal) {
      throw new NotFoundException(`Saving goal not found`);
    }

    return goal;
  }
}
