import { IsString, IsEnum } from 'class-validator';

export enum PostType {
  POST = 'POST',
  STORY = 'STORY',
}

export class CreatePostDto {
  @IsString()
  prompt: string;

  @IsEnum(PostType)
  type: PostType;
}
