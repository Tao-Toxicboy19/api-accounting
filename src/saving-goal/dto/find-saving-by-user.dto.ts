import { PickType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { SavingGoalDto } from './saving-goal.dto';

export class FindSavingByUserDto extends PickType(SavingGoalDto, ['user']) {
  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;
}
