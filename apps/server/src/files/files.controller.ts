import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Headers,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import {
  GetFilesRequestSchema,
  UploadFileRequestSchema,
  type GetFilesRequest,
  type UploadFileRequest,
} from '@recruitment/schema';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Get()
  async getFiles(@Query() query: GetFilesRequest, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedQuery = GetFilesRequestSchema.parse(query);
    return this.filesService.getFiles(validatedQuery, currentUser);
  }

  @Get('presigned-url')
  async getPresignedUrl(@Query() query: any, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.filesService.getPresignedUrl(query, currentUser);
  }

  @Get(':id')
  async getFileById(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.filesService.getFileById(id, currentUser);
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.filesService.downloadFile(id, currentUser);
  }

  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadFileRequest,
    @Headers() headers: any,
  ) {
    const currentUser = this.extractUserFromHeaders(headers);
    const validatedData = UploadFileRequestSchema.parse(uploadDto);
    return this.filesService.uploadFile(file, validatedData, currentUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('id') id: string, @Headers() headers: any) {
    const currentUser = this.extractUserFromHeaders(headers);
    return this.filesService.deleteFile(id, currentUser);
  }

  private extractUserFromHeaders(headers: any) {
    return {
      id: headers['x-user-id'],
      email: headers['x-user-email'],
      roles: JSON.parse(headers['x-user-roles'] || '[]'),
      departments: JSON.parse(headers['x-user-departments'] || '[]'),
    };
  }
}
