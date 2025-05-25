import { Module } from '@nestjs/common';
import { SavingGoalService } from './saving-goal.service';
import { SavingGoalController } from './saving-goal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SavingGoal, SavingGoalSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavingGoal.name, schema: SavingGoalSchema },
    ]),
  ],
  controllers: [SavingGoalController],
  providers: [SavingGoalService],
})
export class SavingGoalModule {}
