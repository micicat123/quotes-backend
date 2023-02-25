import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Quote } from 'src/quote/models/quote.entity';
import { Vote } from 'src/vote/models/vote.entity';
import { In, Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService extends CommonService {
    constructor( 
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>,
        @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>
    ){
        super(userRepository);
    }

    async getUserStatistics(id:number):Promise<any>{
        const quotes = await this.quoteRepository.query(`SELECT COUNT(quote_id) FROM "Quotes" WHERE user_id=${id}`);
        const karma = await this.quoteRepository.query(`SELECT COUNT(quote) FROM "Quotes" q INNER JOIN "Votes" v USING(quote_id) WHERE v.user_id=${id} AND decision != 1`);
        return [quotes, karma];
    }

    async getUsersMostLikedQuotes(id:number, page:number):Promise<any>{
        const take = 4;
        const [data, total] =  await this.quoteRepository.findAndCount({
            where: {
                user:{
                    user_id: id
                }
            },
            order: {
                upvotes: "DESC"
            },
            take,
            skip: take * (page - 1),
            relations: ['user']
        });
        return data;
    }

    async getUsersQuotes(id:number, page:number): Promise<any>{        
        const take = 4;
        const [data, total] =  await this.quoteRepository.findAndCount({
            where: {
                user:{
                    user_id: id
                }
            },
            take,
            skip: take * (page - 1),
            relations: ['user']
        });
        return data;
    }

    async getQuotesLikedByUser(id:number, page:number): Promise<any>{

        const ids = await this.voteRepository.query(`SELECT q.quote_id FROM "Users" u INNER JOIN "Votes" v USING(user_id) INNER JOIN "Quotes" q USING(quote_id) WHERE u.user_id = ${id} AND decision = 2;`);

        const idValues = ids.map(obj => obj.quote_id);

        const take = 4;
        const [data, total] =  await this.quoteRepository.findAndCount({
            where: {
                quote_id: In(idValues)
            },
            order: {
                upvotes: "DESC"
            },
            take,
            skip: take * (page - 1),
            relations: ['user']
        });

        return data;
    }

}
