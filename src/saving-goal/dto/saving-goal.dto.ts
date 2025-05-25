import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';

export class SavingGoalDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  targetAmount: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
