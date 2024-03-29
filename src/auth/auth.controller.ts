import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Req, Res, UseGuards} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import * as bcrypt from 'bcryptjs';

import { config } from 'dotenv';
config();

@Controller('auth')
export class AuthController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ){}

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({passthrough: true}) response : Response
    ){

        const found = await this.userService.findBy({email: email});
        if (!found) throw new NotFoundException("User not found");
        if (!await bcrypt.compare(password, (await found).password)) throw new BadRequestException("Invalid credentials.");

        const jwt = await this.jwtService.sign({user_id: (await found).user_id}, {expiresIn: '300s', secret: process.env.JWT_SECRET});

        response.cookie('jwt', jwt, {httpOnly: true});

        return jwt;
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({passthrough: true}) response : Response){
        response.clearCookie('jwt');
        return console.log("logged out");
    }

    @UseGuards(AuthGuard)
    @Get('user')
    async getUser(@Req() request : Request){
        const user_id = await this.authService.userId(request);
        return this.userService.findBy({user_id: user_id});
    } 

} 