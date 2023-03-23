import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CommonModule } from 'src/common/common.module';
import { Quote } from 'src/quote/models/quote.entity';
import { User } from 'src/user/models/user.entity';
import { UserService } from 'src/user/user.service';
import { Vote } from 'src/vote/models/vote.entity';
import { UploadsController } from './uploads.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User, Quote, Vote]), CommonModule],
    controllers: [UploadsController],
    providers: [TypeOrmModule, UserService, AuthService, JwtService]
  })
  export class UploadsModule {}
  
