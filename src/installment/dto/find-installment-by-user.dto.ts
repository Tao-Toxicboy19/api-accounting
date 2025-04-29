import { PickType } from '@nestjs/mapped-types';
import { CreateInstallmentDto } from './create-installment.dto';

export class FindInstallmentByUserDto extends PickType(CreateInstallmentDto, [
  'user',
]) {}
