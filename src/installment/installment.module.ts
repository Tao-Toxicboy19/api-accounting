import { Module } from '@nestjs/common';
import { InstallmentService } from './installment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Installment, InstallmentSchema } from './schema';
import { InstallmentController } from './installment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Installment.name, schema: InstallmentSchema },
    ]),
  ],
  controllers: [InstallmentController],
  providers: [InstallmentService],
  exports: [InstallmentService],
})
export class InstallmentModule {}
