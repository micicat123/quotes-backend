import { IsNotEmpty, IsEmail, Validate } from 'class-validator';
import { Unique } from 'typeorm';

export class UserCreateDto{

    @IsNotEmpty()
    first_name: string;
    
    @IsNotEmpty()
    last_name: string;
    
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    password_confirm: string;

    karma: number;

    picture: string;
}