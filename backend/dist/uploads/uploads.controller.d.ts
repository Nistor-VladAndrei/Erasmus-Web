import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(file: Express.Multer.File): {
        filename: string;
        originalName: string;
        url: string;
        size: number;
        mimetype: string;
    };
}
