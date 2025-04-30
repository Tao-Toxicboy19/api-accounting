import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstallmentDocument = Installment & Document;

@Schema({ timestamps: true })
export class Installment {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true, index: true })
  user: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  interestRate: number;

  @Prop()
  paidMonths: number;

  @Prop({ required: true })
  totalMonth: number;

  @Prop({ default: 0 })
  totalPrice: number;

  @Prop()
  note?: string;

  @Prop()
  deletedAt?: Date;
}

export const InstallmentSchema = SchemaFactory.createForClass(Installment);
