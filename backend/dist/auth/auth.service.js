"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const user = await this.usersService.findByUsername(loginDto.username);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isValidated) {
            throw new common_1.UnauthorizedException('Your account is pending admin approval');
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
    async signup(signupDto) {
        const existingUser = await this.usersService.findByUsername(signupDto.username);
        if (existingUser) {
            throw new common_1.ConflictException('User with this username already exists');
        }
        if (signupDto.password.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters long');
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(signupDto.password, saltRounds);
        const user = await this.usersService.create({
            username: signupDto.username,
            passwordHash,
            role: 'user',
            isValidated: false,
        });
        console.log('User created:', user.username);
        console.log('User requires admin validation');
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
    async validateUser(username, password) {
        const user = await this.usersService.findByUsername(username);
        if (user && await bcrypt.compare(password, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async validateUserAccount(userId, adminId) {
        const admin = await this.usersService.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            throw new common_1.UnauthorizedException('Only admins can validate user accounts');
        }
        const user = await this.usersService.update(userId, { isValidated: true });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
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
    async getPendingUsers(adminId) {
        const admin = await this.usersService.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            throw new common_1.UnauthorizedException('Only admins can view pending users');
        }
        const pendingUsers = await this.usersService.findPendingUsers();
        return pendingUsers;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map