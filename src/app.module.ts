import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMconfig } from './config/database_config';
import { UserModule } from './user/user.module';
import { QuoteModule } from './quote/quote.module';
import { VoteModule } from './vote/vote.module';
import { CommonModule } from './common/common.module';
import { config } from 'dotenv';

@Module({
  imports: [ConfigModule.forRoot({
              isGlobal: true,
              load: [config]
            }),
            TypeOrmModule.forRoot(typeORMconfig),
            UserModule,
            QuoteModule,
            VoteModule,
            CommonModule
           ],
  controllers: [],
  providers: [],
})
export class AppModule {}
