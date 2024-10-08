import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['type', 'files'],
    },
  })
  @UseInterceptors(FilesInterceptor('files', 100))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    return files.map((file) => ({
      url: `${file.destination.replace(/\\/g, '/').split('/public/')[1]}/${
        file.filename
      }`,
    }));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/single')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `${file.destination.replace(/\\/g, '/').split('/public/')[1]}/${
        file.filename
      }`,
    };
  }
}
