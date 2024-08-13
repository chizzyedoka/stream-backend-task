import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    // check if existing user
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
      walletBalance: 0,
    });

    // save and return the user
    return user.save();
  }
}
