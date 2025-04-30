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
  interestRate?: number;

  @IsOptional()
  @IsNumber()
  paidMonths?: number;

  @IsOptional()
  @IsNumber()
  totalMonth?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
