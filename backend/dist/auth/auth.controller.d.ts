import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/SignupDto.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
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
    debugToken(auth: string): {
        success: boolean;
        decoded: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        decoded?: undefined;
    };
    getPendingUsers(req: any): Promise<import("../users/entities/user.entity").User[]>;
    validateUser(userId: string, req: any): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            role: string;
            isValidated: boolean;
        };
    }>;
}
