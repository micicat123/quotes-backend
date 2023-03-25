import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
require('dotenv').config();

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private jwtService : JwtService){}

  async canActivate(context: ExecutionContext){
    try{
      const request = context.switchToHttp().getRequest();
      const jwt = request.cookies['jwt'];
      await this.jwtService.verifyAsync(jwt, {secret: process.env.JWT_SECRET});
      return true;
    }
    catch(err){
      console.log('Failed to pass auth guard');
      throw new UnauthorizedException('You are not authorized to access this resource');
    }
  }
}
