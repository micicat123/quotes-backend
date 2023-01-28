import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { skip } from 'rxjs';
import { CommonService } from 'src/common/common.service';
import { User } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { Quote } from './models/quote.entity';

@Injectable()
export class QuoteService extends CommonService{
    constructor( 
        @InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>
    ){
        super(quoteRepository);
    }

    async paginateRecent(page:number): Promise<any>{
        const take = 9;
        const[data, total] = await this.repository.findAndCount({
            order: {
                created_at: "DESC"
            },
            take,
            skip: take * (page - 1),
            relations: ['user']
        });
        return data;
    }

    async paginateUpvoted(page:number): Promise<any>{
        const take = 9;
        const[data, total] = await this.repository.findAndCount({
            order: {
                upvotes: "DESC"
            },
            take,
            skip: take * (page - 1),
            relations: ['user']
        });
        return data;
    }

    async randomQuote(): Promise<any>{
        const quotes = await this.repository.find({relations: ['user']});
    
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
}
