import { IsNotEmpty, IsEmail, Validate } from 'class-validator';

export class QuoteUpdateDto{

    @IsNotEmpty()
    quote: string;
}