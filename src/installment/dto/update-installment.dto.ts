import { PartialType } from '@nestjs/mapped-types';
import { CreateInstallmentDto } from './create-installment.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateInstallmentDto extends PartialType(CreateInstallmentDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
