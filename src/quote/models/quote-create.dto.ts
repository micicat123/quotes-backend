import { IsNotEmpty } from 'class-validator';

export class QuoteCreateDto{

    @IsNotEmpty()
    quote: string;
}