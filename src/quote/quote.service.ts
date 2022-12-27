import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { Quote } from './models/quote.entity';

@Injectable()
export class QuoteService extends CommonService{
    constructor( 
        @InjectRepository(Quote) private readonly userRepository: Repository<Quote>
    ){
        super(userRepository);
    }

    async paginate(page=1): Promise<any>{
        const take = 9;
        const[data, total] = await this.repository.findAndCount({
            take,
            skip: take * (page - 1)
        });
        return {
            data: data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        }
        
    }
}
