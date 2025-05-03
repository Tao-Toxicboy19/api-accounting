import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateInstallmentDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsOptional()
  @IsNumber()
  interestRate: number;

  @IsOptional()
  @IsNumber()
  paidMonths?: number;

  @IsNotEmpty()
  @IsNumber()
  totalMonth?: number;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
