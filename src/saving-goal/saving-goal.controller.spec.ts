import { Test, TestingModule } from '@nestjs/testing';
import { SavingGoalController } from './saving-goal.controller';
import { SavingGoalService } from './saving-goal.service';

describe('SavingGoalController', () => {
  let controller: SavingGoalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavingGoalController],
      providers: [SavingGoalService],
    }).compile();

    controller = module.get<SavingGoalController>(SavingGoalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
