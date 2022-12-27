import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Quote } from 'src/quote/models/quote.entity';
import { QuoteService } from 'src/quote/quote.service';
import { Vote } from './models/vote.entity';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, Vote])],
  controllers: [VoteController],
  providers: [VoteService, QuoteService, TypeOrmModule, AuthService, JwtService]
})
export class VoteModule {}
