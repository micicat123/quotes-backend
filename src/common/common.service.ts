import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user.entity';
import { Repository } from 'typeorm';
import { Quote } from '../quote/models/quote.entity';
import { Vote } from '../vote/models/vote.entity';

@Injectable()
export abstract class CommonService {

    protected constructor(
        protected readonly repository: Repository<any>
    ){} 

    async create(data:any): Promise<any> {
        const response:any = await this.repository.save(data);

        if(response.user_id) return Object.assign(new User(), response);
        else if(response.quote_id) return Object.assign(new Quote(), response);
        else if(response.vote_id) return Object.assign(new Vote(), response);
        else return response;
    }

    async findBy(data: any): Promise<any>{
        return await this.repository.findOne({where: data});
    }

    async all(): Promise<any>{
        return this.repository.find();
    }

    async delete(id: any): Promise<any> {
        return this.repository.delete(id);
    }
}
