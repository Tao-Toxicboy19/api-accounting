import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionService } from './transaction.service';
import { Transaction } from './schema/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockTransaction = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getModelToken(Transaction.name),
          useValue: jest.fn().mockImplementation(() => mockTransaction),
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and save a transaction', async () => {
    const dto: CreateTransactionDto = {
      user: 'user123',
      type: 'income',
      title: 'เงินเดือน',
      amount: 10000,
      date: '2024-04-01',
      category: 'salary',
      note: 'เงินเดือนเมษายน',
    };

    const mockSavedTransaction = {
      ...dto,
      date: new Date(dto.date),
      save: jest.fn().mockResolvedValue({
        _id: 'tx123',
        ...dto,
        date: new Date(dto.date),
      }),
    };

    const mockConstructor = jest.fn(() => mockSavedTransaction);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).transactionModel = mockConstructor;

    const result = await service.create(dto);

    expect(mockConstructor).toHaveBeenCalledWith({
      ...dto,
      date: new Date(dto.date),
    });
    expect(mockSavedTransaction.save).toHaveBeenCalled();
    expect(result.title).toEqual('เงินเดือน');
  });
});
