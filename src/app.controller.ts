import { Controller, ForbiddenException, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({
    summary: "Uploads a file locally (txt)",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
      schema: {
      type: "object",
      properties: {
          file: {
          type: "string",
          format: "binary",
          },
      },
      },
  })
  @ApiResponse({
      status: 201,
  })
  @Post('upload-local')
  @UseInterceptors(FileInterceptor("file"))
  upload_file(
      @UploadedFile() file: Express.Multer.File
  ) {
      if (!file.mimetype.startsWith("text")) {
          throw new ForbiddenException(
              `Il file caricato non è un file di testo. Riprovare.`
          );
      }

      const newBlob = {
      mime: file.mimetype,
      value: randomUUID() + "." + file.originalname.split(".").pop(),
      name: file.originalname,
      };

      return this.appService.uploadFile(newBlob, file);
  }

  @ApiOperation({
    summary: "Uploads a file from url (txt)",
  })
  @ApiBody({
      schema: {
      type: "object",
      properties: {
          file: {
          type: "string",
          format: "binary",
          },
      },
      },
  })
  @ApiResponse({
      status: 201,
  })
  @Post('upload-url')
  async analyzeRemoteFile(@Query('url') url: string) {
    const result = await this.appService.analyzeRemoteFile(url);
    return result;
  }
}
