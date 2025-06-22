import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './schema';
import {
  FindTransactionByUserDto,
  DeleteTransactionByUserDto,
  CreateTransactionWithInstallmentDto,
  UserIdDto,
  UpdateTransactionDto,
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

  @Post('test/n8n')
  async testN8N(@Body() dto): Promise<string> {
    console.log(dto);
    return 'ok';
  }

  @Post('list')
  async findAllByUser(
    @Body() dto: FindTransactionByUserDto,
  ): Promise<{ items: Transaction[]; total: number; totalPage: number }> {
    return this.transactionService.findAllByUser(dto);
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

  @Post('update')
  async updateTransaction(
    @Body() dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.updateTransaction(dto);
  }
}
