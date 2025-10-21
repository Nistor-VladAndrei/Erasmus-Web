import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadsService {
  private uploadPath = process.env.UPLOAD_DIR || './uploads';

  constructor() {
    // Ensure upload directory exists
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  getUploadPath(): string {
    return this.uploadPath;
  }

  generateFileUrl(filename: string): string {
    // Return URL that will be accessible from the frontend
    const baseUrl = process.env.BASE_URL ;
    return `${baseUrl}/uploads/${filename}`;
  }
}