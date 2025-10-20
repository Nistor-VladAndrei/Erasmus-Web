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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("./entities/article.entity");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
let ArticlesService = class ArticlesService {
    constructor(articlesRepository) {
        this.articlesRepository = articlesRepository;
    }
    createSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }
    sanitizeContent(html) {
        return (0, sanitize_html_1.default)(html, {
            allowedTags: sanitize_html_1.default.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
            allowedAttributes: {
                ...sanitize_html_1.default.defaults.allowedAttributes,
                img: ['src', 'alt', 'title', 'width', 'height'],
                a: ['href', 'target', 'rel'],
            },
            allowedSchemes: ['http', 'https', 'mailto'],
        });
    }
    async findAll(page = 1, limit = 10) {
        const [data, total] = await this.articlesRepository.findAndCount({
            where: { published: true },
            relations: ['author'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }
    async findAllForAdmin() {
        return this.articlesRepository.find({
            relations: ['author'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const article = await this.articlesRepository.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article with ID ${id} not found`);
        }
        return article;
    }
    async findBySlug(slug) {
        const article = await this.articlesRepository.findOne({
            where: { slug },
            relations: ['author'],
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article with slug ${slug} not found`);
        }
        return article;
    }
    async create(createArticleDto, authorId) {
        const slug = this.createSlug(createArticleDto.title);
        const sanitizedContent = this.sanitizeContent(createArticleDto.content);
        const article = this.articlesRepository.create({
            ...createArticleDto,
            content: sanitizedContent,
            slug,
            authorId,
        });
        return this.articlesRepository.save(article);
    }
    async update(id, updateArticleDto) {
        const article = await this.findOne(id);
        if (updateArticleDto.title) {
            article.slug = this.createSlug(updateArticleDto.title);
        }
        if (updateArticleDto.content) {
            updateArticleDto.content = this.sanitizeContent(updateArticleDto.content);
        }
        Object.assign(article, updateArticleDto);
        return this.articlesRepository.save(article);
    }
    async remove(id) {
        const article = await this.findOne(id);
        await this.articlesRepository.remove(article);
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map