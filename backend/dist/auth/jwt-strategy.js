"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const users_service_1 = require("../users/users.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(usersService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'dd78f0b8838262efe46967704cd3ed77',
        });
        this.usersService = usersService;
        console.log('JwtStrategy initialized with secret:', process.env.JWT_SECRET || 'dd78f0b8838262efe46967704cd3ed77');
    }
    async validate(payload) {
        console.log('=== JWT VALIDATION STARTED ===');
        console.log('Received payload:', payload);
        try {
            const user = await this.usersService.findById(payload.sub);
            console.log('Found user:', user);
            if (!user) {
                console.log('User not found in database');
                throw new common_1.UnauthorizedException('User not found');
            }
            const result = { userId: user.id, email: user.email, role: user.role };
            console.log('Returning user object:', result);
            return result;
        }
        catch (error) {
            console.error('Validation error:', error);
            throw error;
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], JwtStrategy);
//# sourceMappingURL=jwt-strategy.js.map