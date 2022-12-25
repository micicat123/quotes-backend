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
}
