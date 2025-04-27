import { PickType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeteleTransactionByUser extends PickType(CreateTransactionDto, [
  'user',
]) {
  @IsString()
  @IsNotEmpty()
  id: string;
}
