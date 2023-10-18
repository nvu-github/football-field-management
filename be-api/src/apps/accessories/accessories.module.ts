import { Module } from '@nestjs/common';
import { AccessoriesService } from './accessories.service';
import { AccessoriesController } from './accessories.controller';

import { PrismaService } from '@src/prisma.service';
import { UploadService } from 'common/upload/upload.service';


@Module({
  controllers: [AccessoriesController],
  providers: [AccessoriesService, PrismaService, UploadService],
})
export class AccessoriesModule {}
