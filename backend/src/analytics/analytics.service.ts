import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentOption } from '../ai/ai.service';

interface AnalyticsData {
  postId: string;
  userId: string;
  selectedOption: string;
  aiModel: string;
  prompt: string;
  responseTime: number;
  optionA: ContentOption;
  optionB: ContentOption;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackSelection(data: AnalyticsData) {
    const selectedContent =
      data.selectedOption === 'A' ? data.optionA : data.optionB;

    return this.prisma.analytics.create({
      data: {
        postId: data.postId,
        userId: data.userId,
        selectedOption: data.selectedOption,
        aiModel: data.aiModel,
        promptLength: data.prompt.length,
        captionLength: selectedContent.caption.length,
        hashtagCount: selectedContent.hashtags.length,
        responseTime: data.responseTime,
      },
    });
  }

  async getUserInsights(userId: string) {
    // Get user's selection patterns
    const selectionStats = await this.prisma.analytics.groupBy({
      by: ['selectedOption'],
      where: { userId },
      _count: true,
    });

    // Get AI model usage
    const modelStats = await this.prisma.analytics.groupBy({
      by: ['aiModel'],
      where: { userId },
      _count: true,
      _avg: {
        responseTime: true,
      },
    });

    // Get average metrics
    const avgMetrics = await this.prisma.analytics.aggregate({
      where: { userId },
      _avg: {
        promptLength: true,
        captionLength: true,
        hashtagCount: true,
        responseTime: true,
      },
    });

    // Get content type preferences
    const contentTypeStats = await this.prisma.$queryRaw`
      SELECT p.type, COUNT(a.id) as count
      FROM "Analytics" a
      JOIN "Post" p ON a."postId" = p.id
      WHERE a."userId" = ${userId}
      GROUP BY p.type
    `;

    // Get time-based insights (posts by hour)
    const timeStats = await this.prisma.$queryRaw`
      SELECT 
        EXTRACT(HOUR FROM a."createdAt") as hour,
        COUNT(*) as count
      FROM "Analytics" a
      WHERE a."userId" = ${userId}
      GROUP BY EXTRACT(HOUR FROM a."createdAt")
      ORDER BY hour
    `;

    return {
      totalPosts: selectionStats.reduce((sum, stat) => sum + stat._count, 0),
      selectionPreference: {
        optionA:
          selectionStats.find((s) => s.selectedOption === 'A')?._count || 0,
        optionB:
          selectionStats.find((s) => s.selectedOption === 'B')?._count || 0,
      },
      aiModelUsage: modelStats.map((stat) => ({
        model: stat.aiModel,
        count: stat._count,
        avgResponseTime: Math.round(stat._avg.responseTime || 0),
      })),
      averageMetrics: {
        promptLength: Math.round(avgMetrics._avg.promptLength || 0),
        captionLength: Math.round(avgMetrics._avg.captionLength || 0),
        hashtagCount: Math.round(avgMetrics._avg.hashtagCount || 0),
        responseTime: Math.round(avgMetrics._avg.responseTime || 0),
      },
      contentTypePreference: contentTypeStats,
      postsByHour: timeStats,
    };
  }

  async getGlobalInsights() {
    // Get overall platform statistics
    const totalUsers = await this.prisma.user.count();
    const totalPosts = await this.prisma.post.count();
    const totalAnalytics = await this.prisma.analytics.count();

    // Get popular hashtags
    const recentPosts = await this.prisma.post.findMany({
      take: 100,
      orderBy: { createdAt: 'desc' },
      select: {
        optionA: true,
        optionB: true,
        selectedOption: true,
      },
    });

    const hashtagMap = new Map<string, number>();
    recentPosts.forEach((post) => {
      if (post.selectedOption) {
        const content =
          post.selectedOption === 'A'
            ? (post.optionA as { hashtags: string[] })
            : (post.optionB as { hashtags: string[] });

        content.hashtags?.forEach((tag) => {
          hashtagMap.set(tag, (hashtagMap.get(tag) || 0) + 1);
        });
      }
    });

    const popularHashtags = Array.from(hashtagMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Get AI model performance
    const modelPerformance = await this.prisma.analytics.groupBy({
      by: ['aiModel'],
      _count: true,
      _avg: {
        responseTime: true,
      },
    });

    return {
      totalUsers,
      totalPosts,
      totalSelections: totalAnalytics,
      popularHashtags,
      aiModelPerformance: modelPerformance.map((perf) => ({
        model: perf.aiModel,
        usageCount: perf._count,
        avgResponseTime: Math.round(perf._avg.responseTime || 0),
      })),
    };
  }

  // Get suggestions based on user's history
  async getAISuggestions(userId: string) {
    // Get user's recent selections
    const recentAnalytics = await this.prisma.analytics.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        post: true,
      },
    });

    // Analyze patterns
    const patterns = {
      preferredCaptionLength: 0,
      preferredHashtagCount: 0,
      commonWords: new Map<string, number>(),
      preferredPostType: '',
    };

    recentAnalytics.forEach((analytics) => {
      patterns.preferredCaptionLength += analytics.captionLength;
      patterns.preferredHashtagCount += analytics.hashtagCount;
    });

    patterns.preferredCaptionLength = Math.round(
      patterns.preferredCaptionLength / recentAnalytics.length,
    );
    patterns.preferredHashtagCount = Math.round(
      patterns.preferredHashtagCount / recentAnalytics.length,
    );

    return {
      suggestions: {
        idealCaptionLength: patterns.preferredCaptionLength,
        idealHashtagCount: patterns.preferredHashtagCount,
        tip: this.generateTip(patterns),
      },
    };
  }

  private generateTip(patterns: {
    preferredCaptionLength: number;
    preferredHashtagCount: number;
    commonWords: Map<string, number>;
    preferredPostType: string;
  }): string {
    if (patterns.preferredCaptionLength > 150) {
      return 'You tend to prefer longer, story-telling captions. Keep engaging your audience with detailed content!';
    } else if (patterns.preferredCaptionLength < 50) {
      return 'You prefer concise captions. Consider adding more context occasionally for deeper engagement.';
    } else {
      return 'Your caption length is well-balanced. Keep mixing short and long content for variety!';
    }
  }
}
