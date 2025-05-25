import { Body, Controller, Post } from '@nestjs/common';
import { SavingGoalService } from './saving-goal.service';
import {
  FindSavingByUserDto,
  SavingGoalDto,
  UpdateSavingGoalStatusDto,
  UserWithIdDto,
} from './dto';
import { SavingGoal } from './schema';

@Controller('saving-goal')
export class SavingGoalController {
  constructor(private readonly savingGoalService: SavingGoalService) {}

  @Post('create')
  async create(@Body() dto: SavingGoalDto): Promise<SavingGoal> {
    return this.savingGoalService.saveSavingGoal(dto);
  }

  @Post('status')
  async updateStatus(
    @Body() dto: UpdateSavingGoalStatusDto,
  ): Promise<SavingGoal | null> {
    return this.savingGoalService.updateStatus(dto);
  }

  @Post('one')
  async findOne(@Body() dto: UserWithIdDto): Promise<SavingGoal> {
    return this.savingGoalService.findOneByUser(dto);
  }

  @Post('list')
  async findAllByUser(@Body() dto: FindSavingByUserDto): Promise<{
    items: SavingGoal[];
    total: number;
    totalPage: number;
  }> {
    return this.savingGoalService.findAllByUser(dto);
  }
}
