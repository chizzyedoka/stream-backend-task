import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/schemas/Transaction.schema';
import { CreateTransactionDto } from './dto/CreateTransaction.dto';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const { amount, type, userId } = createTransactionDto;

    // find the user making the transaction by userId
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Handle debit and credit logic
    if (type == 'debit') {
      if (user.walletBalance < amount) {
        // create a failed transaction in the DB
        const transaction = new this.transactionModel({
          amount,
          type,
          status: 'failed',
          userId: user._id,
        });
        await transaction.save();
        throw new BadRequestException('Insufficient balance');
      }
      user.walletBalance -= amount;
    } else if (type == 'credit') {
      user.walletBalance += amount;
    }

    // Save the new user's balance
    await user.save();

    // create the transaction
    const transaction = new this.transactionModel({
      amount,
      type,
      status: 'completed',
      userId: user._id,
    });

    return await transaction.save();
  }
}
