import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
require('dotenv').config();

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private jwtService : JwtService){}

  canActivate(context: ExecutionContext){
    try{
      const request = context.switchToHttp().getRequest();
      const jwt = request.cookies['jwt'];
      return this.jwtService.verifyAsync(jwt, {secret: process.env.JWT_SECRET})
    }
    catch(err){
      console.log('Failed to pass auth guard');
      return false;
    }
  }
}
