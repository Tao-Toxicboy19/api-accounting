import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { SavingGoalDto } from './saving-goal.dto';

export class UserWithIdDto extends PickType(SavingGoalDto, ['user']) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
