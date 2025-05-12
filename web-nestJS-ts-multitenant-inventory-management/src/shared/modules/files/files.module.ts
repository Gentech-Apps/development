import { Logger, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.getOrThrow<string>('multer.dest'),
        storage: memoryStorage(),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [FilesService, Logger],
})
export class FilesModule {}
