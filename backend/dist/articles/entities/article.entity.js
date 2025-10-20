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
exports.Article = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Article = class Article {
};
exports.Article = Article;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Article.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Article.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Article.prototype, "excerpt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Article.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Article.prototype, "coverImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Article.prototype, "imageUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Article.prototype, "published", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.articles),
    (0, typeorm_1.JoinColumn)({ name: 'authorId' }),
    __metadata("design:type", user_entity_1.User)
], Article.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Article.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Article.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Article.prototype, "updatedAt", void 0);
exports.Article = Article = __decorate([
    (0, typeorm_1.Entity)('articles')
], Article);
//# sourceMappingURL=article.entity.js.map