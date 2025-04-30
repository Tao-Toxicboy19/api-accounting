import { Body, Controller, Post } from '@nestjs/common';
import { InstallmentService } from './installment.service';
import {
  CreateInstallmentDto,
  FindInstallmentByUserDto,
  LabelValueDto,
} from './dto';
import { Installment } from './schema';

@Controller('installment')
export class InstallmentController {
  constructor(private readonly installmentService: InstallmentService) {}

  @Post('create')
  async create(@Body() dto: CreateInstallmentDto): Promise<Installment> {
    return this.installmentService.createInstallment(dto);
  }

  @Post('by/user')
  async find(@Body() dto: FindInstallmentByUserDto): Promise<LabelValueDto[]> {
    return this.installmentService.findInstallmentByUser(dto.user);
  }
}
