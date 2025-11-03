import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/SignupDto.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is validated by admin
    if (!user.isValidated) {
      throw new UnauthorizedException('Your account is pending admin approval');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    
    console.log('Generated payload:', payload);
    console.log('Generated token:', token);
    
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  async signup(signupDto: SignupDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByUsername(signupDto.username);
    
    if (existingUser) {
      throw new ConflictException('User with this username already exists');
    }

    // Validate password strength
    if (signupDto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(signupDto.password, saltRounds);

    // Create the user (initially not validated)
    const user = await this.usersService.create({
      username: signupDto.username,
      passwordHash,
      role:  'user',
      isValidated: false, // User needs admin approval
    });

    console.log('User created:', user.username);
    console.log('User requires admin validation');
    
    // Return success message without token (user cannot login yet)
    return {
      message: 'Account created successfully. Please wait for admin approval before logging in.',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        isValidated: user.isValidated,
      },
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  // Admin validates a user account
  async validateUserAccount(userId: string, adminId: string) {
    // Verify admin has permission
    const admin = await this.usersService.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new UnauthorizedException('Only admins can validate user accounts');
    }

    // Validate the user
    const user = await this.usersService.update(userId, { isValidated: true });
    
    if (!user) {
      throw new BadRequestException('User not found');
    }

    console.log(`User ${user.username} validated by admin ${admin.username}`);
    
    return {
      message: 'User account validated successfully',
      user: {
        id: user.id,
        email: user.username,
        role: user.role,
        isValidated: user.isValidated,
      },
    };
  }

  // Get all pending users (for admin dashboard)
  async getPendingUsers(adminId: string) {
    const admin = await this.usersService.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      throw new UnauthorizedException('Only admins can view pending users');
    }

    const pendingUsers = await this.usersService.findPendingUsers();
    return pendingUsers;
  }
}