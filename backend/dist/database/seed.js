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
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const user_entity_1 = require("../users/entities/user.entity");
const article_entity_1 = require("../articles/entities/article.entity");
const bcrypt = __importStar(require("bcryptjs"));
async function seed() {
    try {
        await data_source_1.AppDataSource.initialize();
        console.log('Database connected for seeding');
        const userRepository = data_source_1.AppDataSource.getRepository(user_entity_1.User);
        const articleRepository = data_source_1.AppDataSource.getRepository(article_entity_1.Article);
        const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });
        let adminUser;
        if (!existingAdmin) {
            const passwordHash = await bcrypt.hash('admin', 10);
            adminUser = userRepository.create({
                username: 'admin',
                passwordHash,
                role: 'admin',
                isValidated: true,
            });
            await userRepository.save(adminUser);
            console.log('Admin user created: admin@fratii-buzesti.ro / admin123');
        }
        else {
            adminUser = existingAdmin;
            console.log('Admin user already exists');
        }
        const sampleArticles = [
            {
                title: 'Erasmus+ Mobility Program Launch',
                slug: 'erasmus-mobility-program-launch',
                excerpt: 'We are excited to announce the launch of our new Erasmus+ mobility program for students and teachers.',
                content: `<h2>A New Chapter in International Education</h2>
          <p>Colegiul Național "Frații Buzești" is proud to announce the launch of our comprehensive Erasmus+ mobility program. This initiative will provide unprecedented opportunities for our students and teachers to engage with European partners.</p>
          <h3>Program Highlights</h3>
          <ul>
            <li>Student exchanges with partner schools across Europe</li>
            <li>Teacher training workshops in innovative pedagogical methods</li>
            <li>Collaborative projects with international institutions</li>
            <li>Cultural immersion experiences</li>
          </ul>
          <p>The program will commence in the fall semester and run for three years, with opportunities for extension. We believe this will significantly enhance the educational experience of our community.</p>`,
                coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
                imageUrls: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800'],
                published: true,
                authorId: adminUser.id,
            },
            {
                title: 'Student Exchange to Germany',
                slug: 'student-exchange-germany',
                excerpt: 'Ten of our students will participate in a two-week exchange program with our partner school in Berlin.',
                content: `<h2>Berlin Awaits Our Students</h2>
          <p>We are thrilled to announce that ten students from our school have been selected to participate in an exciting exchange program with Friedrich-Ebert-Gymnasium in Berlin, Germany.</p>
          <h3>Program Details</h3>
          <p>During their two-week stay, students will:</p>
          <ul>
            <li>Attend classes alongside German students</li>
            <li>Stay with host families to experience German culture firsthand</li>
            <li>Participate in guided tours of historical sites</li>
            <li>Work on collaborative STEM projects</li>
          </ul>
          <p>This exchange is funded by our Erasmus+ grant and represents a unique opportunity for cultural and educational growth.</p>`,
                coverImageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
                imageUrls: ['https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800'],
                published: true,
                authorId: adminUser.id,
            },
            {
                title: 'Teacher Training Workshop in Portugal',
                slug: 'teacher-training-portugal',
                excerpt: 'Our faculty members attended an innovative teaching methods workshop in Lisbon as part of the Erasmus+ program.',
                content: `<h2>Professional Development in Lisbon</h2>
          <p>Five teachers from Colegiul Național "Frații Buzești" recently returned from a transformative week-long workshop in Lisbon, Portugal, focused on modern pedagogical approaches.</p>
          <h3>Key Learnings</h3>
          <p>The workshop covered several important topics:</p>
          <ul>
            <li>Project-based learning methodologies</li>
            <li>Digital tools for classroom engagement</li>
            <li>Inclusive education practices</li>
            <li>Assessment for learning strategies</li>
          </ul>
          <p>Our teachers are now implementing these innovative approaches in their classrooms, benefiting all our students. The workshop also strengthened our network of European educational partners.</p>
          <blockquote>"This experience has revolutionized my approach to teaching. I'm excited to share what I've learned with my colleagues and students." - Prof. Maria Ionescu</blockquote>`,
                coverImageUrl: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=800',
                imageUrls: ['https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=800'],
                published: true,
                authorId: adminUser.id,
            },
        ];
        for (const articleData of sampleArticles) {
            const existing = await articleRepository.findOne({ where: { slug: articleData.slug } });
            if (!existing) {
                const article = articleRepository.create(articleData);
                await articleRepository.save(article);
                console.log(`Article created: ${articleData.title}`);
            }
        }
        console.log('Seeding completed successfully');
        await data_source_1.AppDataSource.destroy();
    }
    catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}
seed();
//# sourceMappingURL=seed.js.map