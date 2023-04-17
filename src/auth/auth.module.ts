import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { config } from 'dotenv';
import { AuthGuard } from './auth.guard';
config();

@Module({
  imports: [  
    forwardRef(() => UserModule),
    CommonModule,
    JwtModule.register({ secret: process.env.JWT_SECRET})
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthModule]
})
export class AuthModule {}
