import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '../common/common.module';
import { Quote } from '../quote/models/quote.entity';
import { User } from '../user/models/user.entity';
import { UserService } from '../user/user.service';
import { Vote } from '../vote/models/vote.entity';
import { UploadsController } from './uploads.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Quote, Vote]), CommonModule],
    controllers: [UploadsController],
    providers: [TypeOrmModule, UserService, AuthService, JwtService]
  })
  export class UploadsModule {}
  
