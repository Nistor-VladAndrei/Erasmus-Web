import { Controller, Post, Body, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              private jwtService: JwtService, // Inject JwtService

  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('debug-token')
  debugToken(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    
    console.log('=== TOKEN DEBUG ===');
    console.log('Received token:', token);
    console.log('JwtService secret:', process.env.JWT_SECRET || 'dd78f0b8838262efe46967704cd3ed77');
    
    try {
      // Try to verify with the JwtService
      const decoded = this.jwtService.verify(token);
      console.log('✅ Token verified successfully:', decoded);
      return { success: true, decoded };
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return { success: false, error: error.message };
    }
  }

}