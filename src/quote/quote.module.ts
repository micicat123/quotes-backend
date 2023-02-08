import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Vote } from 'src/vote/models/vote.entity';
import { Quote } from './models/quote.entity';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, Vote])],
  controllers: [QuoteController],
  providers: [TypeOrmModule, AuthService, JwtService, QuoteService],
  exports: []
})
export class QuoteModule {}
