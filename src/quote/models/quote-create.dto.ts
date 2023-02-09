import { IsNotEmpty, IsEmail, Validate } from 'class-validator';

export class QuoteCreateDto{

    @IsNotEmpty()
    quote: string;
}