import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true, index: true })
  user: string;

  @Prop({
    required: true,
    enum: ['income', 'expense', 'installment', 'saving'],
  })
  type: 'income' | 'expense' | 'installment' | 'saving';

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  date: Date;

  @Prop()
  category?: string;

  @Prop({ type: Types.ObjectId, ref: 'Installment' })
  installmentId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SavingGoal' })
  savingGoalId?: Types.ObjectId;

  @Prop()
  note?: string;

  @Prop()
  deletedAt?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.index(
  { deletedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 },
);
