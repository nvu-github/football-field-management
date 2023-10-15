import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  deleteFile(filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.unlink(join(__dirname, '../../..', `public/${filePath}`), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
