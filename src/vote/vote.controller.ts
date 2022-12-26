import { Controller, Get, Param, Put, Req } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { QuoteService } from 'src/quote/quote.service';
import { VoteService } from './vote.service';
import { Request } from 'express';

@Controller('vote')
export class VoteController {

    constructor( 
        private voteService: VoteService,
        private quoteService: QuoteService,
        private authService: AuthService
    ){ }

    //count all votes with user id that decision is not 1 to get karma for user
    @Get()
    async all(){
        return this.voteService.all();
    }

    @Put('/upvote/:id')
    async upvote( 
        @Param('id') quote_id: number,
        @Req() request: Request

    ){
        const quote = await this.quoteService.findBy({quote_id: quote_id});
        const user_id = await this.authService.userId(request);

        //check if user interacted with quote already
        const votes = await this.voteService.all();
        for (const vote of votes) {

            //user upvoted a quote before
            if (vote.user_id == user_id && vote.quote_id == quote_id && vote.decision == 2) {
                await this.quoteService.update(quote_id, {
                    upvotes: quote.upvotes - 1,
                    score: (quote.upvotes - 1) - quote.downvotes
                });
                await this.voteService.update(vote.vote_id, {decision: 1});

                return this.quoteService.findBy({quote_id: quote_id});
            }

            //user downvoted a quote before
            else if (vote.user_id == user_id && vote.quote_id == quote_id && vote.decision == 0) {
                await this.quoteService.update(quote_id, {
                    upvotes: quote.upvotes + 1,
                    downvotes: quote.downvotes - 1,
                    score: (quote.upvotes + 1) - (quote.downvotes - 1)
                });
                await this.voteService.update(vote.vote_id, {decision: 2});

                return this.quoteService.findBy({quote_id: quote_id});
            }

            //user didnt didnt downvote quote but has interacted with it
            else if (vote.user_id == user_id && vote.quote_id == quote_id && vote.decision == 1){
                await this.quoteService.update(quote_id, {
                    upvotes: quote.upvotes + 1,
                    score: (quote.upvotes + 1) - (quote.downvotes)
                });
                await this.voteService.update(vote.vote_id, {decision: 2});

                return this.quoteService.findBy({quote_id: quote_id});
            }
        }

        //user hasnt interacted with quote yet
        await this.quoteService.update(quote_id, {
            upvotes: quote.upvotes + 1,
            score: (quote.upvotes + 1) - quote.downvotes

        });
        return this.voteService.create({
            decision: 2,
            user: user_id,
            quote: quote_id
        });
    }

    @Put('/downvote/:id')
    async downvote( 
        @Param('id') quote_id: number,
        @Req() request: Request

    ){
        const quote = await this.quoteService.findBy({quote_id: quote_id});
        const user_id = await this.authService.userId(request);

        //check if user interacted witg quote already
        const votes = await this.voteService.all();
        for (const vote of votes) {

            //user downvotes a quote before
            if (vote.user_id == user_id && vote.quote_id == quote_id && vote.decision == 0) {
                await this.quoteService.update(quote_id, {
                    downvotes: quote.downvotes - 1,
                    score: quote.upvotes - (quote.downvotes - 1)
                });
                await this.voteService.update(vote.vote_id, {decision: 1});

                return this.quoteService.findBy({quote_id: quote_id});
            }

            //user upvoted a quote before
            if (vote.user_id == user_id && vote.quote_id == quote_id && vote.decision == 2) {
                await this.quoteService.update(quote_id, {
                    upvotes: quote.upvotes - 1,
                    downvotes: quote.downvotes + 1,
                    score: (quote.upvotes - 1) - (quote.downvotes + 1)
                });
                await this.voteService.update(vote.vote_id, {decision: 0});

                return this.quoteService.findBy({quote_id: quote_id});
            }

            //user didnt didnt upvote quote but has interacted with it
            else if (vote.user_id == user_id && vote.quote_id == quote_id && vote.decision == 1){
                await this.quoteService.update(quote_id, {
                    upvotes: quote.downvotes + 1,
                    score: (quote.upvotes) - (quote.downvotes + 1)
                });
                await this.voteService.update(vote.vote_id, {decision: 0});

                return this.quoteService.findBy({quote_id: quote_id});
            }
        }

        //user hasnt interacted with quote yet
        await this.quoteService.update(quote_id, {
            downvotes: quote.downvotes + 1,
            score: quote.upvotes - (quote.downvotes + 1)
        });

        return this.quoteService.create({
            decision: 0,
            user: user_id,
            quote: quote_id
        });
    }
}