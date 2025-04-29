import { Body, Controller, Post } from '@nestjs/common';
import { InstallmentService } from './installment.service';
import {
  CreateInstallmentDto,
  FindInstallmentByUserDto,
  LabelValueDto,
} from './dto';

@Controller('installment')
export class InstallmentController {
  constructor(private readonly installmentService: InstallmentService) {}

  @Post('create')
  async create(@Body() dto: CreateInstallmentDto): Promise<{ id: string }> {
    return this.installmentService.createInstallment(dto);
  }

  @Post('by/user')
  async find(@Body() dto: FindInstallmentByUserDto): Promise<LabelValueDto[]> {
    return this.installmentService.findInstallmentByUser(dto.user);
  }
}
