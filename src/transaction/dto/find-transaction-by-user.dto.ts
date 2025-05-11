import { PickType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class FindTransactionByUserDto extends PickType(CreateTransactionDto, [
  'user',
]) {
  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;
}
