import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './User.schema';

@Schema()
export class Transaction extends Document {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['debit', 'credit'] })
  type: string;

  @Prop({ default: 'pending', enum: ['pending', 'completed', 'failed'] })
  status: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
