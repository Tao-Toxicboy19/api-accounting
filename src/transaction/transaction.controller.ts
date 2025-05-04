import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './schema';
import {
  FindTransactionByUserDto,
  DeleteTransactionByUserDto,
  CreateTransactionWithInstallmentDto,
  UserIdDto,
} from './dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  async create(
    @Body() dto: CreateTransactionWithInstallmentDto,
  ): Promise<Transaction> {
    return this.transactionService.create(dto);
  }

  @Post('list')
  async findAllByUser(
    @Body() dto: FindTransactionByUserDto,
  ): Promise<Transaction[]> {
    return this.transactionService.findAllByUser(dto.user);
  }

  @Post('delete')
  async softDelete(@Body() dto: DeleteTransactionByUserDto): Promise<void> {
    return this.transactionService.softDeleteByUser(dto);
  }

  @Post('summary')
  async getIncomeAndExpenseSummary(
    @Body() dto: UserIdDto,
  ): Promise<{ income: number; expense: number }> {
    return this.transactionService.getIncomeAndExpenseSum(dto.user);
  }
}
