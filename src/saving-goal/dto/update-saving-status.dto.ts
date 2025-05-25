import { PickType } from '@nestjs/mapped-types';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SavingGoalDto } from './saving-goal.dto';

export class UpdateSavingGoalStatusDto extends PickType(SavingGoalDto, [
  'user',
]) {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['active', 'completed', 'cancelled'])
  status: 'active' | 'completed' | 'cancelled';

  @IsNotEmpty()
  @IsString()
  id: string;
}
