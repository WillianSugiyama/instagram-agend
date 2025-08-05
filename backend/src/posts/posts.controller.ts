import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest {
  user: {
    id: string;
    email: string;
  };
}

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(
    @Request() req: AuthRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.createPost(req.user.id, createPostDto);
  }

  @Get()
  async getUserPosts(@Request() req: AuthRequest) {
    return this.postsService.getUserPosts(req.user.id);
  }

  @Get(':id')
  async getPost(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.postsService.getPost(req.user.id, id);
  }

  @Patch(':id/select')
  async updatePostSelection(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePostSelection(
      req.user.id,
      id,
      updatePostDto,
    );
  }
}
