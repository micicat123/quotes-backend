import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Quote } from 'src/quote/models/quote.entity';
import { Vote } from 'src/vote/models/vote.entity';
import { Repository } from 'typeorm';
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
        const take = 4;
        const [data, total] =  await this.voteRepository.findAndCount({
            where: {
                user:{
                    user_id: id
                },
                decision: 2
            },
            order: {
                quote: {
                    upvotes: "DESC"
                }
            },
            take,
            skip: take * (page - 1),
            relations: ['user', 'quote']
        });
        return data;
    }

}
