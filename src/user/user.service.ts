import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService extends CommonService {
    constructor( 
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){
        super(userRepository);
    }

    async getUsersQuotes(id:number): Promise<any>{
        //user's most liked quotes
        //user's most recently posted quotes
        return this.userRepository.query(`SELECT * FROM "Quotes" WHERE user_id = ${id};`);
    }

    async getQuotesLikedByUser(id:number): Promise<any>{
        //quotes liked by user ordered by most likes
        return this.userRepository.query(`SELECT * FROM "Quotes" q INNER JOIN "Votes" v USING(quote_id) WHERE v.user_id = ${id} AND decision=2;`);
    }

}
