import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './schema/transaction.schema';
import { FindTransactionDto } from './dto/find-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  async create(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(dto);
  }

  @Post('by-user')
  async findByUser(@Body() body: FindTransactionDto): Promise<Transaction[]> {
    return this.transactionService.findByUser(body.userId);
  }
}
