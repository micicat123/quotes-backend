import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { QuoteCreateDto } from './models/quote-create.dto';
import { Quote } from './models/quote.entity';
import { QuoteService } from './quote.service';
import { Request } from 'express';
import { QuoteUpdateDto } from './models/quote-update.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('quote')
export class QuoteController {

    constructor( 
        private quoteService: QuoteService,
        private authService: AuthService
    ){ }

    @Get(':page')
    async all(@Param('page') page: number){
        return this.quoteService.paginate(page);
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
    @Put(':id')
    async update(
        @Param('id') id: number, 
        @Body() body: QuoteUpdateDto)
    {
        await this.quoteService.update(id,body);
        return this.quoteService.findBy({quote_id: id});
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: number){
        return this.quoteService.delete(id);
    }
    
}
