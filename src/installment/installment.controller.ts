import { Body, Controller, Post } from '@nestjs/common';
import { InstallmentService } from './installment.service';
import {
  CreateInstallmentDto,
  FindInstallmentByUserDto,
  DeleteInstallmentByUserDto,
  LabelValueDto,
} from './dto';
import { Installment } from './schema';

@Controller('installments')
export class InstallmentController {
  constructor(private readonly installmentService: InstallmentService) {}

  @Post('create')
  async create(@Body() dto: CreateInstallmentDto): Promise<Installment> {
    return this.installmentService.create(dto);
  }

  @Post('dropdown')
  async getDropdown(
    @Body() dto: FindInstallmentByUserDto,
  ): Promise<LabelValueDto[]> {
    return this.installmentService.getDropdownOptions(dto.user);
  }

  @Post('list')
  async getList(@Body() dto: FindInstallmentByUserDto): Promise<Installment[]> {
    return this.installmentService.getUserInstallments(dto.user);
  }

  @Post('delete')
  async delete(@Body() dto: DeleteInstallmentByUserDto): Promise<void> {
    return this.installmentService.softDeleteByUser(dto);
  }
}
