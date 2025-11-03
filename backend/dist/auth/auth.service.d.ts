import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/SignupDto.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            username: string;
            role: string;
        };
    }>;
    signup(signupDto: SignupDto): Promise<{
        message: string;
        user: {
            id: string;
            username: string;
            role: string;
            isValidated: boolean;
        };
    }>;
    validateUser(username: string, password: string): Promise<any>;
    validateUserAccount(userId: string, adminId: string): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            role: string;
            isValidated: boolean;
        };
    }>;
    getPendingUsers(adminId: string): Promise<import("../users/entities/user.entity").User[]>;
}
