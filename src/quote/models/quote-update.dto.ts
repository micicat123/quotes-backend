import { IsNotEmpty } from 'class-validator';

export class QuoteUpdateDto{

    @IsNotEmpty()
    quote: string;
}