import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsEnum(['income', 'expense', 'installment', 'saving'])
  type: 'income' | 'expense' | 'installment' | 'saving';

  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
