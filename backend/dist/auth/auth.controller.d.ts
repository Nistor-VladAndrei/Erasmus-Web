import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: string;
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
}
