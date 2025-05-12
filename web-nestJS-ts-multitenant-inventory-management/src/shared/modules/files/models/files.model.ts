import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Readable } from 'stream';

export class MultipartMulterFileModel implements Express.Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export class S3StorageFileResponseModel {
  @ApiPropertyOptional({
    description: 'The url of the uploaded file',
    required: false,
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    description: 'The key of the uploded file',
    required: false,
  })
  @IsString()
  @IsOptional()
  key?: string;
}
