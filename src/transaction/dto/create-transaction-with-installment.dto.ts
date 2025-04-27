import { CreateTransactionDto } from './create-transaction.dto';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTransactionWithInstallmentDto extends CreateTransactionDto {
  @IsOptional()
  @IsString()
  installmentId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  interestRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  paidMonths?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  totalMonth?: number;
}
