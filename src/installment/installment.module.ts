import { Module } from '@nestjs/common';
import { InstallmentService } from './installment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Installment, InstallmentSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Installment.name, schema: InstallmentSchema },
    ]),
  ],
  controllers: [],
  providers: [InstallmentService],
  exports: [InstallmentService],
})
export class InstallmentModule {}
