import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMconfig } from './config/database_config';
import { UserModule } from './user/user.module';
import { QuoteModule } from './quote/quote.module';
import { VoteModule } from './vote/vote.module';
import { CommonModule } from './common/common.module';
import { config } from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploadsController } from './uploads/uploads.controller';
import { UploadsModule } from './uploads/uploads.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule.forRoot({
              isGlobal: true,
              load: [config]
            }),
            TypeOrmModule.forRoot(typeORMconfig),
            UserModule,
            QuoteModule,
            VoteModule,
            CommonModule,
            AuthModule,
            ServeStaticModule.forRoot({
              rootPath: join(__dirname, '..', 'uploads'),
              serveRoot: '/images',
            }),
            UploadsModule,
           ],
  controllers: [UploadsController],
  providers: [AuthService, JwtService],
})
export class AppModule {}
