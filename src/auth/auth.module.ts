import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.register({
    secret: process.env.JWT_SECRET || 'default_secret_key',
    signOptions: { expiresIn: '24h' },
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, JwtStrategy],
  exports: [AuthService, JwtModule, JwtAuthGuard],
})
export class AuthModule { }
