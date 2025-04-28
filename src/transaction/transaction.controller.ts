import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './schema';
import {
  FindTransactionByUserDto,
  DeteleTransactionByUser,
  CreateTransactionWithInstallmentDto,
} from './dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  async create(
    @Body() dto: CreateTransactionWithInstallmentDto,
  ): Promise<Transaction> {
    return this.transactionService.create(dto);
  }

  @Post('by/user')
  async findByUser(
    @Body() dto: FindTransactionByUserDto,
  ): Promise<Transaction[]> {
    return this.transactionService.findByUser(dto.user);
  }

  @Post('delete')
  async deleteTransaction(@Body() dto: DeteleTransactionByUser): Promise<void> {
    return this.transactionService.deleteByUser(dto);
  }
}
