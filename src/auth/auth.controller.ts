import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: "Register new user",
    description: "Creates a new user account with email and password"
  })
  @Post('signup')
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @ApiOperation({
    summary: "User login",
    description: "Authenticates user and returns JWT access token"
  })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

}


