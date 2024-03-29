import { BadRequestException, Body, Controller, Get, Post, Param, Put, Req, UseGuards, Delete } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateInfoDto } from './models/user-update-info.dto';
import { UserUpdatePasswordDto } from './models/user-update-password.dto';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';

@Controller('user')
export class UserController {
    
    constructor(
        private userService: UserService,
        private authService: AuthService
    ){ }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User>{
        
        if (body.password !== body.password_confirm) throw new BadRequestException("Passwords do not match!");
        const user = await this.userService.findBy({email: body.email});
        if (user) throw new BadRequestException("This email is already in use!");

        const hashed_password = await bcrypt.hash(body.password, 12);
        const {first_name, last_name, email, ...data} = body;

        return this.userService.create({
            first_name,
            last_name,
            email,
            karma: 0,
            picture: '', 
            password: hashed_password
        }); 
    }

    @UseGuards(AuthGuard)
    @Put('update-password')
    async updatePassword(   
        @Body() body: UserUpdatePasswordDto,
        @Req() request: Request
    ){
        const id = await this.authService.userId(request);
        const found = await this.userService.findBy({user_id: id});
        if (!await bcrypt.compare(body.old_password, (await found).password)) throw new BadRequestException("Current pasword is not correct.");
        if (body.password !== body.password_confirm) throw new BadRequestException("Passwords do not match!");

        const hashed = await bcrypt.hash(body.password.toString(), 12);

        await this.userService.create({
            user_id: id, 
            password: hashed
         });
        return this.userService.findBy(id);
    }

    @UseGuards(AuthGuard)
    @Put('update-info')
    async updateInfo(   
        @Body() body: UserUpdateInfoDto,
        @Req() request: Request
    ){
        const id = await this.authService.userId(request);

        return await this.userService.create({
            user_id: id,
            email: body.email,
            first_name: body.first_name,
            last_name: body.last_name
        });
    }

    @Get('/statistics/:id')
    async getUserStatistics( 
        @Param('id') id: number
    ): Promise<User>{

        return this.userService.getUserStatistics(id); 
    }

    @Get('/quotes/:page/:id')
    async getUserQuotes(
        @Param('page') page: number,
        @Param('id') id: number,
    ): Promise<User>{
        return this.userService.getUsersQuotes(id, page); 
    }

    @Get('/quotes-liked/:page/:id')
    async getUserLikedQuotes(
        @Param('page') page: number,
        @Param('id') id: number,
    ): Promise<User>{
        return this.userService.getQuotesLikedByUser(id, page); 
    }

    @Get('/most-liked-quotes/:page/:id')
    async getUsersMostLikedQuotes(
        @Param('page') page: number,
        @Param('id') id: number,
    ): Promise<User>{
        return this.userService.getUsersMostLikedQuotes(id, page); 
    }
}
