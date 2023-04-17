import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '../common/common.module';
import { Quote } from '../quote/models/quote.entity';
import { Vote } from '../vote/models/vote.entity';
import { User } from './models/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Quote, Vote]), CommonModule],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService],
  exports: [UserService]
})
export class UserModule {}
