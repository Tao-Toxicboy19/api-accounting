import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateInstallmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

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

  @IsOptional()
  @IsString()
  note?: string;
}
