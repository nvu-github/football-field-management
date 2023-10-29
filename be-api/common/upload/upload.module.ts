import { Body } from './../../../front-end/.nuxt/components.d';
import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as slug from 'slug';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.diskStorage({
        destination: function (req: any, file: any, cb) {
          const TYPE_FOLDER = 'avatar';
          const { type } = req.body;
          const { id } = req.user;

          if (
            file.mimetype.match(
              /image\/png|image\/jpeg|image\/jpg|imagesvg\+xml|image\/gif|image\/svg\+xml/,
            )
          ) {
            const pathDir = path.join(
              __dirname,
              '..',
              '..',
              '..',
              'public',
              'uploads',
              type,
              type === TYPE_FOLDER ? String(id) : '',
            );
            if (!fs.existsSync(pathDir)) {
              fs.mkdirSync(pathDir);
            }
            cb(null, pathDir);
          } else {
            cb(
              new HttpException(
                `Unsupported file type ${path.extname(file.originalname)}`,
                HttpStatus.BAD_REQUEST,
              ),
              null,
            );
          }
        },
        filename: function (req, file, cb) {
          const timestamp = new Date().getTime();
          const fileExtname = path.extname(file.originalname);
          const fileName = file.originalname.replace(fileExtname, '');
          const uniqueSuffix = `${timestamp}${Math.round(Math.random() * 1e6)}`;
          cb(null, `${slug(fileName)}-${uniqueSuffix}${fileExtname}`);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        if (
          file.mimetype.match(
            /image\/png|image\/jpeg|image\/jpg|imagesvg\+xml|image\/gif|image\/svg\+xml/,
          )
        ) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${path.extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
      preservePath: true,
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
