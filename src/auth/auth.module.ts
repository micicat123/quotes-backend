import { forwardRef, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
require('dotenv').config();

@Module({
  imports: [  
    forwardRef(() => UserModule),
    CommonModule,
    JwtModule.register({ secret: '123'})
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthModule]
})
export class AuthModule {}
