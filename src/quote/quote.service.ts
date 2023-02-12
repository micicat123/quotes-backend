import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Vote } from 'src/vote/models/vote.entity';
import { Not, Repository } from 'typeorm';
import { Quote } from './models/quote.entity';

@Injectable()
export class QuoteService extends CommonService{
    constructor( 
        @InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>,
        @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>
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

    async getDecisions(user_id:number): Promise<any>{
        return await this.voteRepository.find({
            select: {
                decision: true,
                quote:{
                    quote_id: true
                }
            },
            where: {
                user:{
                    user_id: user_id
                },
                decision: Not(1)
            },
            relations: ['quote']
        });
    }

    async deleteQuote(quote_id: number): Promise<any> {
        const vote_ids = await this.voteRepository.find({
            select: {
                vote_id: true
            },
            where: {
                quote:{
                    quote_id: quote_id
                },
            },
        });

        for (const vote_id of vote_ids){
            await this.voteRepository.delete(vote_id);
        }

        return await this.quoteRepository.delete(quote_id);
    }
}
