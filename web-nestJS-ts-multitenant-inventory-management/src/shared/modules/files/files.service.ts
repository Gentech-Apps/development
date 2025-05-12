import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MultipartMulterFileModel, S3StorageFileResponseModel } from './models/files.model';
import { getS3FileKey, getS3ObjectUrl } from './utils';

@Injectable()
export class FilesService {
  private readonly bucketPath: string;
  private readonly bucketName: string;
  private readonly s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.bucketPath = this.configService.getOrThrow<string>('aws.s3.bucket_path');
    this.bucketName = this.configService.getOrThrow<string>('aws.s3.bucket_name');
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('aws.s3.region'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('aws.s3.access_key_id'),
        secretAccessKey: this.configService.getOrThrow<string>('aws.s3.secret_access_key'),
      },
    });
  }

  // INFO: To upload files on AWS S3
  async uploadFileToS3({
    keyExists,
    file,
    identifier = 'any_folder_name_as_an_identifier',
  }: {
    keyExists?: string;
    file: MultipartMulterFileModel;
    identifier?: string;
  }): Promise<S3StorageFileResponseModel> {
    try {
      // If keyExists then Delete object first and then move towards to insert
      if (keyExists) {
        const deleteCommand = this.#getDeleteObjectCommand(keyExists);
        await this.s3Client.send(deleteCommand);
        this.logger.log(
          JSON.stringify({
            context: `File has been deleted from S3 with keyExists: ${keyExists}`,
            message: 'Deleted existing file',
            resource: FilesService.name,
          }),
        );
      }

      const key = getS3FileKey(identifier, file, this.bucketPath);
      const uploadCommand = this.#getPutObjectCommand(key, file);
      await this.s3Client.send(uploadCommand);

      this.logger.log(
        JSON.stringify({
          context: `File has been uploaded successfully to aws s3 with key: ${key}`,
          message: 'Uploaded new file',
          resource: FilesService.name,
        }),
      );

      return {
        url: getS3ObjectUrl(this.bucketName, key),
        key,
      };
    } catch (error) {
      this.logger.error(
        JSON.stringify({
          context: `Error from file operation upload/delete to S3 ${error.message}`,
          message: 'Failed in file operation upload/delete',
          resource: FilesService.name,
        }),
      );
      throw error;
    }
  }

  // INFO: Build deleteObjectCommand, To delete file
  #getDeleteObjectCommand(key: string): DeleteObjectCommand {
    return new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
  }

  // INFO: Build putObjectCommand, to upload file
  #getPutObjectCommand(key: string, file: MultipartMulterFileModel): PutObjectCommand {
    return new PutObjectCommand({
      BucketKeyEnabled: true,
      Bucket: this.bucketName,
      Key: key,
      Body: file?.buffer,
      ACL: 'public-read',
      ContentType: file?.mimetype,
    });
  }
}
