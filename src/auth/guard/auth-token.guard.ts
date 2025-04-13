import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../common/auth.constants";

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenHeader(request);

    if(!token) {
      throw new UnauthorizedException("Token não encontrado");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration)

      request[REQUEST_TOKEN_PAYLOAD_NAME] = payload
    }catch(err) {
      throw new UnauthorizedException("Acesso não autorizado")
    }

    return true;

  }

  extractTokenHeader(request: Request) {
    const authorization = request.headers?.authorization;

    if(!authorization || typeof authorization !== "string") {
      return;
    }

    return authorization.split(' ')[1];
  }
}