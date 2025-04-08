import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './schema/transaction.schema';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  const mockTransaction: Transaction = {
    user: 'user123',
    type: 'income',
    title: 'เงินเดือน',
    amount: 10000,
    date: new Date('2024-04-01'),
    category: 'salary',
    note: 'เงินเดือนเมษายน',
  };

  const mockTransactionService = {
    create: jest.fn().mockResolvedValue(mockTransaction),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create() and return a transaction', async () => {
    const dto: CreateTransactionDto = {
      user: 'user123',
      type: 'income',
      title: 'เงินเดือน',
      amount: 10000,
      date: '2024-04-01',
      category: 'salary',
      note: 'เงินเดือนเมษายน',
    };

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockTransaction);
  });
});
