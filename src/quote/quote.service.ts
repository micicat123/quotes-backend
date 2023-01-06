import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { Quote } from './models/quote.entity';

@Injectable()
export class QuoteService extends CommonService{
    constructor( 
        @InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>
    ){
        super(quoteRepository);
    }

    async paginate(page:number): Promise<any>{
        const take = 9;
        const[data, total] = await this.quoteRepository.findAndCount({
            take,
            skip: take * (page - 1),
            relations: ['user']
        });
        return data;
        
    }

    async randomQuote(): Promise<any>{
        return await this.quoteRepository.query(`SELECT * FROM "Quotes" ORDER BY("RANDOM()") LIMIT 1`);

    }
}
