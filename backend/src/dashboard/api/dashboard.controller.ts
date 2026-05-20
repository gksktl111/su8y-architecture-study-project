import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from '../application/dashboard.service';
import { AuthGuard } from '../../auth/presentation/guards/jwtAuth.guard';
import { DashboardData } from '../domain/rppg.type';

@Controller('api/sessions')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('result-report')
  async getResultReport(): Promise<DashboardData> {
    return this.dashboardService.getResultReport();
  }
}
