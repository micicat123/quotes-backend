import { BadRequestException, Body, Controller, Get, Post, Param, Put, NotFoundException, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateInfoDto } from './models/user-update-info.dto';
import { UserUpdatePasswordDto } from './models/user-update-password.dto';
import { User } from './models/user.entity';
import { UserService } from './user.service';
const bcrypt = require('bcryptjs');

@Controller('user')
export class UserController {
    
    constructor(
        private userService: UserService,
        private authService: AuthService
    ){ }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User>{
        
        if (body.password !== body.password_confirm) throw new BadRequestException("Passwords do not match!");

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

    @Put('update-password')
    async updatePassword(   
        @Body() body: UserUpdatePasswordDto,
        @Req() request: Request
    ){
        const id = await this.authService.userId(request);

        if (!id) throw new NotFoundException("Current password is not correct");
        if (body.password !== body.password_confirm) throw new BadRequestException("Passwords do not match!");

        const hashed = await bcrypt.hash(body.password.toString(), 12);

        await this.userService.update(id,{ 
            password: hashed
         });
        return this.userService.findBy(id);
    }

    @Put('update-info')
    async updateInfo(   
        @Body() body: UserUpdateInfoDto,
        @Req() request: Request
    ){
        const id = await this.authService.userId(request);
        await this.userService.update(id, body);
        return this.userService.findBy(id);
    }

    @Get('/quotes/:id')
    async getUserQuotes(@Param('id') id: number): Promise<User>{
        return this.userService.getUsersQuotes(id); 
    }

    @Get('/likedQuotes/:id')
    async getUserLikedQuotes(@Param('id') id: number): Promise<User>{
        return this.userService.getQuotesLikedByUser(id); 
    }
}
