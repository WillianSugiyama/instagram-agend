import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    @Inject(forwardRef(() => AnalyticsService))
    private analyticsService: AnalyticsService,
  ) {}

  async createPost(userId: string, createPostDto: CreatePostDto) {
    const { prompt, type } = createPostDto;

    // Generate content using AI
    const generatedContent = await this.aiService.generateContent(prompt, type);

    // Save post to database with AI model info
    const post = await this.prisma.post.create({
      data: {
        prompt,
        type,
        optionA: {
          caption: generatedContent.optionA.caption,
          hashtags: generatedContent.optionA.hashtags,
        },
        optionB: {
          caption: generatedContent.optionB.caption,
          hashtags: generatedContent.optionB.hashtags,
        },
        aiModel: generatedContent.aiModel,
        responseTime: generatedContent.responseTime,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return post;
  }

  async updatePostSelection(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ) {
    // Verify post belongs to user
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Update selected option
    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        selectedOption: updatePostDto.selectedOption,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    // Track the selection in analytics
    await this.analyticsService.trackSelection({
      postId: post.id,
      userId: post.userId,
      selectedOption: updatePostDto.selectedOption,
      aiModel: post.aiModel || 'unknown',
      prompt: post.prompt,
      responseTime: post.responseTime || 0,
      optionA: post.optionA as { caption: string; hashtags: string[] },
      optionB: post.optionB as { caption: string; hashtags: string[] },
    });

    return updatedPost;
  }

  async getUserPosts(userId: string) {
    return this.prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async getPost(userId: string, postId: string) {
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
