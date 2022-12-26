import { Injectable, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';

@UseGuards(AuthGuard)
@Injectable()
export class AuthService {
    
    constructor(private jwtService: JwtService){
    }

    async userId(request : Request): Promise<number>{
        const cookie = request.cookies['jwt'];

        const data = await this.jwtService.verify(cookie, {secret: "123"});
        console.log(data);

        return data['user_id'];
    }
}
