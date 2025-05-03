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

  @Prop({ default: 0 })
  interestRate: number;

  @Prop({ default: 0 })
  paidMonths: number;

  @Prop({ required: true, default: 0 })
  totalMonth: number;

  @Prop()
  totalPrice: number;

  @Prop()
  note?: string;

  @Prop()
  deletedAt?: Date;
}

export const InstallmentSchema = SchemaFactory.createForClass(Installment);
InstallmentSchema.index(
  { deletedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 },
);
