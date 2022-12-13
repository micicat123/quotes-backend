import { BadRequestException, Body, Controller, Get, Post, Param } from '@nestjs/common';
import { UserCreateDto } from './models/user-create.dto';
import { User } from './models/user.entity';
import { UserService } from './user.service';
const bcrypt = require('bcryptjs');

@Controller('user')
export class UserController {
    
    constructor(
        private userService: UserService,
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

    @Get(':id')
    async getUserInfo(@Param('id') id: number){
        return this.userService.findBy(id);
    }

}
