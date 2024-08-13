import {
  IsNumber,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsMongoId,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsEnum(['debit', 'credit'])
  @IsNotEmpty()
  type: string;

  @IsMongoId()
  @IsNotEmpty()
  userId: string;
}
