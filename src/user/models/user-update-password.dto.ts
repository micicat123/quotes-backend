import { IsNotEmpty } from 'class-validator';

export class UserUpdatePasswordDto{

    @IsNotEmpty()
    old_password: string;
    
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    password_confirm: string;
}