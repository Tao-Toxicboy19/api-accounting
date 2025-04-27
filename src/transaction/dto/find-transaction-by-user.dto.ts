import { PickType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';

export class FindTransactionByUserDto extends PickType(CreateTransactionDto, [
  'user',
]) {}
