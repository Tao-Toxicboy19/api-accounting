import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SavingGoalDocument = SavingGoal & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class SavingGoal {
  @Prop({ required: true, index: true })
  user: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  targetAmount: number;

  @Prop({ default: 0 })
  currentAmount: number;

  @Prop()
  deadline?: Date;

  @Prop({ enum: ['active', 'completed', 'cancelled'], default: 'active' })
  status: 'active' | 'completed' | 'cancelled';

  @Prop()
  deletedAt?: Date;

  transactions?: Types.ObjectId[];
}

export const SavingGoalSchema = SchemaFactory.createForClass(SavingGoal);
SavingGoalSchema.index(
  { deletedAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 7 },
);
SavingGoalSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'savingGoalId',
});
