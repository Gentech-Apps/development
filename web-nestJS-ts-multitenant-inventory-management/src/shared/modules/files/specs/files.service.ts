import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../files.service';
import { ConfigService } from '@nestjs/config';
import { vi } from 'vitest';
import { Logger } from '@nestjs/common';

describe('#Files.FilesService', () => {
  let service: FilesService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: Logger;

  const mockLogger = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue('multer_folder_dest_path'), // Please check in Files.module.ts file
          },
        },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
