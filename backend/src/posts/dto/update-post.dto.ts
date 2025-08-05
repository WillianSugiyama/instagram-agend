import { IsString, IsIn } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsIn(['A', 'B'])
  selectedOption: 'A' | 'B';
}
