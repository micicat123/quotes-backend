import { IsNotEmpty, IsEmail, Validate } from 'class-validator';
import { User } from 'src/user/models/user.entity';

export class QuoteUpdateDto{

    @IsNotEmpty()
    quote: string;
}