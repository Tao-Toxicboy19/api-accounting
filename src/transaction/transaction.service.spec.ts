import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionService } from './transaction.service';
import { Transaction } from './schema/transaction.schema';
import { InstallmentService } from '../installment/installment.service';
import {
  CreateTransactionWithInstallmentDto,
  UpdateTransactionDto,
} from './dto';
import { TransactionController } from './transaction.controller';
import { TransactionModule } from './transaction.module';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockInstallmentService = {
    incrementPaidMonth: jest.fn(),
  };

  const mockTransactionArray = [
    {
      _id: '1',
      user: 'user123',
      type: 'income',
      title: 'Salary',
      amount: 1000,
      date: new Date('2024-01-01'),
      category: 'Job',
      note: '',
    },
  ];

  const mockTransactionModel = {
    find: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(mockTransactionArray),
    updateOne: jest.fn(),
    model: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getModelToken(Transaction.name),
          useValue: mockTransactionModel,
        },
        {
          provide: InstallmentService,
          useValue: mockInstallmentService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and save a normal transaction', async () => {
    const dto: CreateTransactionWithInstallmentDto = {
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

    expect(mockInstallmentService.incrementPaidMonth).not.toHaveBeenCalled();
    expect(mockConstructor).toHaveBeenCalledWith({
      ...dto,
      date: new Date(dto.date),
    });
    expect(mockSavedTransaction.save).toHaveBeenCalled();
    expect(result.user).toBe('user123');
  });

  it('should call incrementPaidMonth if type is installment', async () => {
    const dto: CreateTransactionWithInstallmentDto = {
      user: 'user456',
      type: 'installment',
      title: 'ค่างวด',
      amount: 2000,
      date: '2024-05-01',
      installmentId: 'inst001',
    };

    const mockSavedTransaction = {
      ...dto,
      date: new Date(dto.date),
      save: jest.fn().mockResolvedValue({
        _id: 'tx999',
        ...dto,
        date: new Date(dto.date),
      }),
    };

    const mockConstructor = jest.fn(() => mockSavedTransaction);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).transactionModel = mockConstructor;

    const result = await service.create(dto);

    expect(mockInstallmentService.incrementPaidMonth).toHaveBeenCalledWith(
      dto.installmentId,
      dto.user,
      dto.amount,
    );
    expect(mockConstructor).toHaveBeenCalledWith({
      ...dto,
      date: new Date(dto.date),
    });
    expect(mockSavedTransaction.save).toHaveBeenCalled();
    expect(result.user).toBe('user456');
  });

  it('should return all transactions for a user', async () => {
    const res = await service.findAllByUser('user123');
    expect(res).toEqual(mockTransactionArray);
  });

  it('should soft delete a transaction by user and id', async () => {
    mockTransactionModel.updateOne.mockResolvedValueOnce({ modifiedCount: 1 });

    await expect(
      service.softDeleteByUser({ user: 'user123', id: '123' }),
    ).resolves.toBeUndefined();

    expect(mockTransactionModel.updateOne).toHaveBeenCalledWith(
      {
        _id: '123',
        user: 'user123',
        deletedAt: { $exists: false },
      },
      {
        $set: { deletedAt: expect.any(Date) },
      },
    );
  });

  it('should throw NotFoundException if no transaction updated', async () => {
    mockTransactionModel.updateOne.mockResolvedValueOnce({ modifiedCount: 0 });

    await expect(
      service.softDeleteByUser({ user: 'user123', id: '123' }),
    ).rejects.toThrow('Transaction not found or already deleted');
  });

  it('should call saveTransaction internally when create is called', async () => {
    const dto: CreateTransactionWithInstallmentDto = {
      user: 'user123',
      type: 'income',
      title: 'เงินเดือน',
      amount: 10000,
      date: '2024-04-01',
      category: 'salary',
      note: 'เงินเดือนเมษายน',
    };

    const mockSavedTransaction = {
      _id: 'tx001',
      ...dto,
      date: new Date(dto.date),
    };

    const mockSave = jest.fn().mockResolvedValue(mockSavedTransaction);
    const mockConstructor = jest.fn(() => ({
      ...mockSavedTransaction,
      save: mockSave,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).model = mockConstructor;

    const result = await service.create(dto);

    expect(mockConstructor).toHaveBeenCalledWith({
      ...dto,
      date: new Date(dto.date),
    });
    expect(mockSave).toHaveBeenCalled();
    expect(result).toEqual(mockSavedTransaction);
  });
});

describe('UpdateTransactionDto', () => {
  it('should be defined', () => {
    expect(new UpdateTransactionDto()).toBeDefined();
  });
  it('should allow partial fields from CreateTransactionDto', () => {
    const dto = new UpdateTransactionDto();
    dto.title = 'Updated Title';
    dto.amount = 1000;

    expect(dto.title).toBe('Updated Title');
    expect(dto.amount).toBe(1000);
  });
});

describe('TransactionModule', () => {
  let service: TransactionService;
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TransactionModule],
    })
      .overrideProvider(getModelToken(Transaction.name))
      .useValue({}) // mock Mongoose model
      .overrideProvider(InstallmentService)
      .useValue({}) // mock InstallmentService
      .compile();

    service = module.get<TransactionService>(TransactionService);
    controller = module.get<TransactionController>(TransactionController);
  });

  it('should compile and resolve service & controller', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });
});
