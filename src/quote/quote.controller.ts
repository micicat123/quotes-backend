import { BadRequestException, Body, Controller, Get, Param, Post, Put, Req, UseGuards, Delete } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { QuoteCreateDto } from './models/quote-create.dto';
import { Quote } from './models/quote.entity';
import { QuoteService } from './quote.service';
import { Request } from 'express';
import { QuoteUpdateDto } from './models/quote-update.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('quote')
export class QuoteController {

    constructor( 
        private quoteService: QuoteService,
        private authService: AuthService
    ){ }

    @Get('/most-upvoted/:page')
    async upvotedQuotes(@Param('page') page: number){
        return this.quoteService.paginateUpvoted(page);
    }

    @UseGuards(AuthGuard)
    @Get('/most-recent/:page')
    async recentQuotes(@Param('page') page: number){
        return this.quoteService.paginateRecent(page);
    }

    @UseGuards(AuthGuard)
    @Get('random')
    async random(){
        return this.quoteService.randomQuote();
    }

    @Get('/user-decisions')
    async decisions(
        @Req() request: Request
    ){
        const user_id = await this.authService.userId(request);
        return this.quoteService.getDecisions(user_id);
    }

    @UseGuards(AuthGuard)
    @Post()
    async create(
        @Body() body: QuoteCreateDto,
        @Req() request: Request
    ): Promise<Quote>{
        const id = await this.authService.userId(request);

        if (body.quote.length < 5) throw new BadRequestException("Your quote is too short!");

        return this.quoteService.create({
            quote: body.quote,
            user: {user_id: id}
        }); 
    }

    @UseGuards(AuthGuard)
    @Put('/:id')
    async update(
        @Param('id') id: any, 
        @Body() body: QuoteUpdateDto)
    {
        return await this.quoteService.create({
            quote_id: parseInt(id),
            quote: body.quote,
        });
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    async deleteQuote(@Param('id') id: number): Promise<Quote>{
        return this.quoteService.deleteQuote(id); 
    }
    
}
