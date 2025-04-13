import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";
import { HashingServiceProtocol } from "./hash/hashing.service";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let hashingService: HashingServiceProtocol;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn().mockResolvedValue({
                id: "123abc",
                name: "Henrique",
                email: "henrique@email.com"
              }),
              findFirst: jest.fn()
            }
          }
        },
        {
          provide: HashingServiceProtocol,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          }
        },
        {
          provide: 'CONFIGURATION(jwt)',
          useValue: {
            secret: "jwt-secret",
            jwtTtl: "3600s",
            audience: "jwt-audience",
            issuer: "jwt-issuer"
          },
        }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol);
    jwtService = module.get<JwtService>(JwtService);
  })
  
  it("should be define users service", () => {
    expect(authService).toBeDefined();
  })

  it("should create a new user", async () => {

    const createUserDto: CreateUserDto = {
      name: "Henrique",
      email: "henrique@email.com",
      password: "Hb27@ds12D"
    }

    jest.spyOn(hashingService, 'hash').mockResolvedValue("HASH_MOCK")

    const result = await authService.signUp(createUserDto);

    expect(hashingService.hash).toHaveBeenCalled();
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: "HASH_MOCK",
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    expect(result).toEqual({
      id: "123abc",
      name: createUserDto.name,
      email: createUserDto.email
    })
  })

  it("should throw error if prisma create fails", async () => {
    const createUserDto: CreateUserDto = {
      name: "Henrique",
      email: "henrique@email.com",
      password: "Hb27@ds12D"
    }

    jest.spyOn(hashingService, "hash").mockResolvedValue("HASH_MOCK")
    jest.spyOn(prismaService.user, "create").mockRejectedValue(new Error("Erro ao cadastrar"));

    await expect(authService.signUp(createUserDto)).rejects.toThrow(
      new HttpException("Falha ao cadastrar usuário!", HttpStatus.BAD_REQUEST)
    )

    await expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password);

    await expect(prismaService.user.create).toHaveBeenCalledWith({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: "HASH_MOCK",
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

  })

  it("should return a JWT token when correct crendentials", async () => {
    const loginDto = {
      email: "henrique@email.com",
      password: "Senha123!"
    };

    const userMock = {
      id: "123abc",
      name: "Henrique",
      email: loginDto.email,
      password: "hashed-password",
      createdAt: new Date()
    };

    const tokenMock = "fake-jwt-token";

    jest.spyOn(prismaService.user, "findFirst").mockResolvedValue(userMock);
    jest.spyOn(hashingService, "compare").mockResolvedValue(true);
    jest.spyOn(jwtService, "signAsync").mockResolvedValue(tokenMock);

    const result = await authService.login(loginDto);

    expect(result).toEqual({
      id: userMock.id,
      name: userMock.name,
      email: userMock.email,
      token: tokenMock
    });

    expect(prismaService.user.findFirst).toHaveBeenCalledWith({
      where: { email: loginDto.email }
    });

    expect(hashingService.compare).toHaveBeenCalledWith(loginDto.password, userMock.password);

    expect(jwtService.signAsync).toHaveBeenCalledWith(
      { sub: userMock.id, email: userMock.email },
      {
        secret: "jwt-secret",
        expiresIn: "3600s",
        audience: "jwt-audience",
        issuer: "jwt-issuer"
      }
    );
  })

  it("should throw UNAUTHORIZED if user with email not found", async () => {
    const loginDto = {
      email: "invalido@email.com",
      password: "HSb23#4sfv"
    };
  
    jest.spyOn(prismaService.user, "findFirst").mockResolvedValue(null);
  
    await expect(authService.login(loginDto)).rejects.toThrow(
      new HttpException("Falha ao fazer o login", HttpStatus.UNAUTHORIZED)
    );
  
    expect(prismaService.user.findFirst).toHaveBeenCalledWith({
      where: { email: loginDto.email }
    });
  });

  it("should throw UNAUTHORIZED if password is invalid", async () => {
    const loginDto = {
      email: "henrique@email.com",
      password: "BSnc2*47dsa"
    };
  
    const userMock = {
      id: "123abc",
      name: "Henrique",
      email: loginDto.email,
      password: "hashed-password",
      createdAt: new Date()
    };
  
    jest.spyOn(prismaService.user, "findFirst").mockResolvedValue(userMock);
    jest.spyOn(hashingService, "compare").mockResolvedValue(false);
  
    await expect(authService.login(loginDto)).rejects.toThrow(
      new HttpException("Usuário ou Senha incorretos", HttpStatus.UNAUTHORIZED)
    );
  
    expect(hashingService.compare).toHaveBeenCalledWith(loginDto.password, userMock.password);
  });
  

})