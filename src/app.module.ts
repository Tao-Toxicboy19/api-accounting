import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://localhost:27017`, {
      user: 'root',
      pass: 'example',
      dbName: 'mikelopster',
      authSource: 'admin',
    }),
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
