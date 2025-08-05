import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

interface AuthRequest {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('insights')
  async getUserInsights(@Request() req: AuthRequest) {
    return this.analyticsService.getUserInsights(req.user.userId);
  }

  @Get('global')
  async getGlobalInsights() {
    return this.analyticsService.getGlobalInsights();
  }

  @Get('suggestions')
  async getAISuggestions(@Request() req: AuthRequest) {
    return this.analyticsService.getAISuggestions(req.user.userId);
  }
}
