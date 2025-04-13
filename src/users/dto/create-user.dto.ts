import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength } from "class-validator";
import { Transform } from "class-transformer";

export class CreateUserDto {

  @IsString()
  @IsNotEmpty({ message: "O campo nome não pode ser vazio" })
  @MaxLength(100, { message: "O nome não pode ultrapassar 100 caracteres" })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: "O campo email não pode ser vazio" })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  },
  { 
    message: 'A senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos' 
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}