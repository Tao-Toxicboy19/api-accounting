import { PickType } from '@nestjs/mapped-types';
import { CreateInstallmentDto } from './create-installment.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteInstallmentByUserDto extends PickType(CreateInstallmentDto, [
  'user',
]) {
  @IsString()
  @IsNotEmpty()
  id: string;
}
