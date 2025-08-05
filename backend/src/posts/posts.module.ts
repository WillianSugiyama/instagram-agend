import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AiModule } from '../ai/ai.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [AiModule, forwardRef(() => AnalyticsModule), PrismaModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
