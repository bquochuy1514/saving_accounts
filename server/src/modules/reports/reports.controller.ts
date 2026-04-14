import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { DailyActivityQueryDto } from './dto/daily-activity-query.dto';
import { MonthlyBooksQueryDto } from './dto/monthly-books-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily-activity')
  @UseGuards(JwtAuthGuard)
  getDailyActivity(@Query() query: DailyActivityQueryDto) {
    return this.reportsService.getDailyActivity(query.date);
  }

  @Get('monthly-books')
  @UseGuards(JwtAuthGuard)
  getMonthlyBooks(@Query() query: MonthlyBooksQueryDto) {
    return this.reportsService.getMonthlyBooks(
      query.savingsTypeId,
      query.month,
      query.year,
    );
  }
}
