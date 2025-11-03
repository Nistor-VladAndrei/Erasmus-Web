import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dd78f0b8838262efe46967704cd3ed77',
    });
    console.log('JwtStrategy initialized with secret:', process.env.JWT_SECRET || 'dd78f0b8838262efe46967704cd3ed77'); // Debug
  }

  async validate(payload: any) {
    console.log('=== JWT VALIDATION STARTED ===');
    console.log('Received payload:', payload);
    
    try {
      const user = await this.usersService.findById(payload.sub);
      console.log('Found user:', user);
      
      if (!user) {
        console.log('User not found in database');
        throw new UnauthorizedException('User not found');
      }
      
      const result = { userId: user.id, username: user.username, role: user.role };
      console.log('Returning user object:', result);
      return result;
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  }
}