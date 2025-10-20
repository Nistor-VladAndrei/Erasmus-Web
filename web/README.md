# Colegiul Național "Frații Buzești" - Erasmus+ Website

A modern, full-stack web application for managing and showcasing Erasmus+ projects, built with React, NestJS, and PostgreSQL.

## 🌟 Features

- **Animated Landing Page** with European Union flag star animation
- **News Management System** with rich text editing
- **Admin Dashboard** for content management
- **Responsive Design** with glassmorphism UI
- **JWT Authentication** with secure password hashing
- **Image Upload** functionality
- **Rich Text Editor** (TipTap) with formatting options
- **Smooth Page Transitions** using Framer Motion

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router v6 for navigation
- React Query for data fetching
- TipTap for rich text editing
- Axios for API calls

**Backend:**
- NestJS + TypeScript
- PostgreSQL database
- TypeORM for database management
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Sanitize-HTML for XSS prevention

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v14 or higher)
- **Docker** and **Docker Compose** (optional, for containerized deployment)

## 🚀 Quick Start

### Option 1: Local Development (Without Docker)

#### Step 1: Clone the Repository

```bash
# Create project directories
mkdir fratii-buzesti-project
cd fratii-buzesti-project
```

#### Step 2: Set Up Backend

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize npm and install dependencies
npm init -y
npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/typeorm @nestjs/jwt @nestjs/passport @nestjs/config typeorm pg passport passport-jwt bcrypt class-validator class-transformer multer sanitize-html reflect-metadata rxjs

npm install -D @nestjs/cli @nestjs/schematics @types/bcrypt @types/express @types/multer @types/node @types/passport-jwt @types/sanitize-html typescript ts-node

# Copy all backend files from the implementation above
# (src/, .env, package.json, tsconfig.json, etc.)

# Create PostgreSQL database
createdb fratii_buzesti

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

**.env (Backend)**
```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=fratii_buzesti

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=1d

CORS_ORIGIN=http://localhost:3000

UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

#### Step 3: Run Database Migrations and Seed Data

```bash
# Run migrations (or use synchronize in development)
npm run migration:run

# Seed the database with sample data
npm run seed
```

#### Step 4: Start Backend Server

```bash
npm run start:dev
```

The backend will be available at `http://localhost:3001`

#### Step 5: Set Up Frontend

```bash
# Open new terminal, navigate to project root
cd ..
mkdir frontend
cd frontend

# Initialize Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install react-router-dom @tanstack/react-query axios framer-motion @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link lucide-react react-hot-toast

npm install -D tailwindcss autoprefixer postcss

# Initialize Tailwind CSS
npx tailwindcss init -p

# Copy all frontend files from the implementation above
# (src/, index.html, .env, tailwind.config.js, etc.)

# Configure environment variables
cp .env.example .env
```

**.env (Frontend)**
```env
VITE_API_URL=http://localhost:3001/api
```

#### Step 6: Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Option 2: Docker Deployment

#### Step 1: Prepare Docker Setup

Ensure you have the `docker-compose.yml` file in the backend directory.

#### Step 2: Build and Start Services

```bash
cd backend
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- NestJS backend on port 3001

#### Step 3: Run Migrations and Seeds

```bash
# Access the backend container
docker exec -it fratii-buzesti-backend sh

# Run seeds
npm run seed

# Exit container
exit
```

#### Step 4: Start Frontend (Separately)

```bash
cd ../frontend
npm run dev
```

## 🔑 Default Credentials

After seeding the database, use these credentials to log in:

- **Email:** `admin@fratii-buzesti.ro`
- **Password:** `admin123`

## 📁 Project Structure



## 🎨 EU Star Animation Explained

The landing page features an animated European Union flag composed of 12 golden stars arranged in a circle on a blue background.

**How it works:**

1. **Initial State:** 12 star SVG elements are scattered randomly across the viewport with opacity 0
2. **Formation:** Stars animate to their final positions forming the EU circle (using Framer Motion)
3. **Breathing Effect:** Once formed, stars have a subtle pulsing animation
4. **Loop:** Every 20 seconds, stars scatter and reform smoothly

**Implementation Details:**
- Stars are positioned using trigonometric calculations (circle coordinates)
- Framer Motion handles smooth transitions and animations
- The animation is responsive and adapts to viewport size

**To switch to UK Union Jack flag:**
Modify `src/components/EUStarAnimation.tsx` to use Union Jack star positions instead of circle layout.

## 🔐 Security Features

### Password Security
- **Bcrypt hashing** with salt rounds (10) for all passwords
- Passwords never stored in plain text
- Password validation enforces minimum 6 characters

### JWT Authentication
- Access tokens expire after 1 day (configurable)
- Tokens are verified on every protected route
- Secure JWT secret (change in production!)

### XSS Prevention
- **Server-side HTML sanitization** using `sanitize-html`
- Only safe HTML tags and attributes are allowed in article content
- Client-side validation for all inputs

### CORS Configuration
- CORS enabled only for specified origins
- Production deployment should use specific domain whitelist

### File Upload Security
- File type validation (images only)
- File size limits (5MB default)
- Unique filename generation to prevent overwrites

## 📤 Image Storage

### Current Implementation (Local Storage)

Images are stored locally in the `backend/uploads/` directory and served statically by NestJS.

**Upload Flow:**
1. Client uploads file to `/api/upload`
2. Multer saves file to `./uploads/` with unique name
3. Server returns public URL: `http://localhost:3001/uploads/filename.jpg`
4. TipTap editor inserts image URL into article HTML

### Migration to AWS S3

To switch to S3 storage:

1. **Install AWS SDK:**
```bash
npm install @aws-sdk/client-s3 multer-s3
```

2. **Update `uploads.service.ts`:**
```typescript
import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Use multerS3 storage in uploads.controller.ts
storage: multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,
  acl: 'public-read',
  key: (req, file, cb) => {
    cb(null, `uploads/${Date.now()}-${file.originalname}`);
  },
})
```

3. **Add S3 environment variables:**
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=fratii-buzesti-media
```

4. **Update URL generation** to return S3 URLs instead of local paths

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Tests

```bash
cd frontend

# Run tests
npm run test
```

## 🌐 Production Deployment

### Backend Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Set production environment variables:**
```env
NODE_ENV=production
DB_HOST=your-production-db-host
JWT_SECRET=secure-random-secret
CORS_ORIGIN=https://yourdomain.com
```

3. **Run migrations:**
```bash
npm run migration:run
```

4. **Start production server:**
```bash
npm run start:prod
```

### Frontend Deployment

1. **Build for production:**
```bash
npm run build
```

2. **Deploy to hosting (Netlify, Vercel, etc.):**
```bash
# Example: Deploy to Netlify
netlify deploy --prod --dir=dist
```

3. **Set environment variables** on hosting platform:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration Options

### Backend Configuration (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `DB_DATABASE` | Database name | fratii_buzesti |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRATION` | Token expiration | 1d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `UPLOAD_DIR` | Upload directory | ./uploads |
| `MAX_FILE_SIZE` | Max upload size (bytes) | 5242880 (5MB) |

### Frontend Configuration (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:3001/api |

## 📚 API Documentation

### Authentication

#### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "admin@fratii-buzesti.ro",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "admin@fratii-buzesti.ro",
    "role": "admin"
  }
}
```

### Articles

#### GET /api/articles
Get all published articles (public).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "data": [...],
  "total": 25
}
```

#### GET /api/articles/:id
Get single article by ID (public).

#### GET /api/articles/admin
Get all articles including unpublished (requires auth).

#### POST /api/articles
Create new article (requires auth).

**Request:**
```json
{
  "title": "Article Title",
  "excerpt": "Brief description",
  "content": "<p>HTML content</p>",
  "coverImageUrl": "https://...",
  "published": true
}
```

#### PUT /api/articles/:id
Update article (requires auth).

#### DELETE /api/articles/:id
Delete article (requires auth).

### File Upload

#### POST /api/upload
Upload image file (requires auth).

**Request:**
- `Content-Type: multipart/form-data`
- Field name: `file`

**Response:**
```json
{
  "filename": "1234567890-image.jpg",
  "originalName": "image.jpg",
  "url": "http://localhost:3001/uploads/1234567890-image.jpg",
  "size": 123456,
  "mimetype": "image/jpeg"
}
```

## 🐛 Troubleshooting

### Common Issues

**Issue:** Database connection error
```
Solution: Ensure PostgreSQL is running and credentials in .env are correct
```

**Issue:** CORS errors
```
Solution: Check CORS_ORIGIN in backend .env matches frontend URL
```

**Issue:** Images not displaying
```
Solution: Verify uploads directory exists and is accessible
```

**Issue:** JWT token invalid
```
Solution: Clear localStorage and log in again
```

**Issue:** Port already in use
```
Solution: Change PORT in .env or kill process using the port
```

## 📝 Additional Notes

### Database Migrations

To create a new migration:
```bash
npm run migration:generate -- src/database/migrations/MigrationName
```

To revert last migration:
```bash
npm run migration:revert
```

### Adding New Features

1. **Backend:** Create new module using NestJS CLI
```bash
nest g module feature-name
nest g service feature-name
nest g controller feature-name
```

2. **Frontend:** Create new component/page in appropriate directory

### Performance Optimization

- Enable **gzip compression** on production server
- Implement **Redis caching** for frequently accessed data
- Use **CDN** for static assets and images
- Enable **database query optimization** and indexing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues or questions:
- Open an issue on GitHub
- Contact: admin@fratii-buzesti.ro

---

Built with ❤️ for Colegiul Național "Frații Buzești" Erasmus+ Program