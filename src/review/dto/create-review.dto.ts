import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsInt()
  @Min(1, { message: 'A nota mínima é 1' })
  @Max(5, { message: 'A nota máxima é 5' })
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

}