import { Controller } from '@nestjs/common';
import { InstallmentService } from './installment.service';

@Controller('installment')
export class InstallmentController {
  constructor(private readonly installmentService: InstallmentService) {}
}
