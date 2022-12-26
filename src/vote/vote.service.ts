import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { Vote } from './models/vote.entity';

@Injectable()
export class VoteService extends CommonService{
    constructor( 
        @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>
    ){
        super(voteRepository);
    }
}
