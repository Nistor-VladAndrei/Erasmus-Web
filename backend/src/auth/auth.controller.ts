import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/SignupDto.dto';
import { Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
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
  @UseGuards(JwtAuthGuard)
  @Get('pending-users')
  async getPendingUsers(@Request() req) {
    const adminId = req.user?.sub ?? req.user?.id;
    return this.authService.getPendingUsers(adminId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('validate-user/:id')            
  @HttpCode(HttpStatus.OK)
  async validateUser(@Param('id') userId: string, @Request() req) {
    // get admin id from token payload (your tokens include `sub`)
    const adminId = req.user?.sub ?? req.user?.id;
    return this.authService.validateUserAccount(userId, adminId);
  }

}