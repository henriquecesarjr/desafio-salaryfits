import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: "O campo Título não pode ser vazio" })
  readonly title: string;

  @IsString()
  @IsNotEmpty({ message: "O campo Título não pode ser vazio" })
  readonly author: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: "A descrição deve ter no máximo 500 caracteres" })
  readonly description?: string;

  @Type(() => Number)
  @IsInt( {message: "O ano deve ser um número inteiro"} )
  @Min(-3000, { message: 'Ano muito antigo, forneça um ano válido.' })
  @Max(new Date().getFullYear(), {message: "Ano maior que o atual"})
  readonly year: number;
}
