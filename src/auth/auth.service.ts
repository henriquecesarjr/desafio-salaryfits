import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private jwtService: JwtService
  ) {}

  async signUp(dto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
  
      if (existingUser) {
        throw new HttpException("Já existe uma conta com esse email cadastrado!", HttpStatus.CONFLICT);
      }

      const passwordHash = await this.hashingService.hash(dto.password);
  
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        }
      })
  
      return user;
    }catch(err) {
      throw new HttpException("Falha ao cadastrar usuário!", HttpStatus.BAD_REQUEST);
    }
  }

  async login(dto: LoginDto): Promise<UserResponseDto> {

    const user = await this.prisma.user.findFirst({
      where:{
        email: dto.email
      }
    })

    if(!user) {
      throw new HttpException("Falha ao fazer o login", HttpStatus.UNAUTHORIZED);
    }

    const passwordIsValid = await this.hashingService.compare(dto.password, user.password);

    if(!passwordIsValid) {
      throw new HttpException("Usuário ou Senha incorretos", HttpStatus.UNAUTHORIZED);
    }

    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer
      }
    )

    const userLogin = {
      id: user.id,
      name: user.name,
      email: user.email,
      token: token
    }

    return userLogin;
  }

}
