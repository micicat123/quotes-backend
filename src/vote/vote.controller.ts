import { Controller, Get, Param, ParseIntPipe, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { QuoteService } from 'src/quote/quote.service';
import { VoteService } from './vote.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('vote')
export class VoteController {

    constructor( 
        private voteService: VoteService,
        private quoteService: QuoteService,
        private authService: AuthService
    ){ }

    async updateQuoteToNeutral(vote){
        await this.voteService.create({
            vote_id: vote.vote_id, 
            decision: 1
        });
    }  

    //count all votes with user id that decision is not 1 to get karma for user
    @Get()
    async all(){
        return this.voteService.all();
    }

    @Put('/upvote/:id')
    async upvote( 
        @Param('id') quote_id: any,
        @Req() request: Request

    ){
        const quote = await this.quoteService.findBy({quote_id: quote_id});
        const user_id = await this.authService.userId(request);

        //check if user interacted with quote already
        const votes = await this.voteService.all();
        for (const vote of votes) {

            //user upvoted a quote before
            if (vote.user.user_id == user_id && vote.quote.quote_id == quote_id && vote.decision == 2) {
                this.updateQuoteToNeutral(vote);
                return await this.quoteService.create({
                    quote_id: parseInt(quote_id),
                    upvotes: quote.upvotes - 1,
                    score: (quote.upvotes - 1) - quote.downvotes
                });
            }

            //user downvoted a quote before
            else if (vote.user.user_id == user_id && vote.quote.quote_id == quote_id && vote.decision == 0) {
                await this.voteService.create({
                    vote_id: vote.vote_id, 
                    decision: 2
                });

                return await this.quoteService.create({
                    quote_id: parseInt(quote_id),
                    upvotes: quote.upvotes + 1,
                    downvotes: quote.downvotes - 1,
                    score: (quote.upvotes + 1) - (quote.downvotes - 1)
                });
            }

            //user didnt didnt downvote quote but has interacted with it
            else if (vote.user.user_id == user_id && vote.quote.quote_id == quote_id && vote.decision == 1){
                await this.voteService.create({
                    vote_id: vote.vote_id,
                    decision: 2
                });

                return await this.quoteService.create({
                    quote_id: parseInt(quote_id),
                    upvotes: quote.upvotes + 1,
                    score: (quote.upvotes + 1) - (quote.downvotes)
                });
            }
        }

        //user hasnt interacted with quote yet
        await this.quoteService.create({
            quote_id: parseInt(quote_id),
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
        @Param('id') quote_id: any,
        @Req() request: Request

    ){
        const quote = await this.quoteService.findBy({quote_id: quote_id});
        const user_id = await this.authService.userId(request);

        //check if user interacted witg quote already
        const votes = await this.voteService.all();
        for (const vote of votes) {

            //user downvoted a quote before
            if (vote.user.user_id == user_id && vote.quote.quote_id == quote_id && vote.decision == 0) {
                this.updateQuoteToNeutral(vote);

                return await this.quoteService.create({
                    quote_id: parseInt(quote_id),
                    downvotes: quote.downvotes - 1,
                    score: quote.upvotes - (quote.downvotes - 1)
                });
            }

            //user upvoted a quote before
            if (vote.user.user_id == user_id && vote.quote.quote_id == quote_id && vote.decision == 2) {
                await this.voteService.create({
                    vote_id: vote.vote_id,    
                    decision: 0
                });

                return await this.quoteService.create({
                    quote_id: parseInt(quote_id),
                    upvotes: quote.upvotes - 1,
                    downvotes: quote.downvotes + 1,
                    score: (quote.upvotes - 1) - (quote.downvotes + 1)
                });
            }

            //user didnt didnt upvote quote but has interacted with it
            else if (vote.user.user_id == user_id && vote.quote.quote_id == quote_id && vote.decision == 1){
                await this.voteService.create({
                    vote_id: vote.vote_id,
                    decision: 0
                });

                return await this.quoteService.create({
                    quote_id: parseInt(quote_id),
                    upvotes: quote.downvotes + 1,
                    score: (quote.upvotes) - (quote.downvotes + 1)
                });
            }
        }

        //user hasnt interacted with quote yet
        await this.quoteService.create({
            quote_id: parseInt(quote_id),
            downvotes: quote.downvotes + 1,
            score: quote.upvotes - (quote.downvotes + 1)
        });

        return this.voteService.create({
            decision: 0,
            user: user_id,
            quote: quote_id
        });
    }
}