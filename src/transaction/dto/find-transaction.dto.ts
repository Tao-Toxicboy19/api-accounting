import { IsString } from 'class-validator';

export class FindTransactionDto {
  @IsString()
  userId: string;
}
