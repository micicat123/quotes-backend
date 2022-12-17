import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserUpdateInfoDto{

    @IsNotEmpty()
    first_name ?: string;
    
    @IsNotEmpty()
    last_name ?: string;
    
    @IsNotEmpty()s
    @IsEmail()
    email ?: string;
}