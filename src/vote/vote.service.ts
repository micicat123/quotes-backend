import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '../common/common.service';
import { Repository } from 'typeorm';
import { Vote } from './models/vote.entity';

@Injectable()
export class VoteService extends CommonService{
    constructor( 
        @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>
    ){
        super(voteRepository);
    }

    async all(): Promise<any>{
        return  await this.voteRepository.find({
            relations: ['user', 'quote']
        });
    }
}
