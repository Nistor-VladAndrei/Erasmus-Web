import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt-strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dd78f0b8838262efe46967704cd3ed77',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1d' },
    }),
  ],
  controllers: [AuthController],
 providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule], // Export these
})
export class AuthModule {}