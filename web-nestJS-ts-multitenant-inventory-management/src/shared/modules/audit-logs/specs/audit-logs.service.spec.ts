import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogsService } from '../audit-logs.service';
import { AuditLog, AuditLogDocument } from '../schema/audit-log.schema';
import { Model } from 'mongoose';
import { vi } from 'vitest';
import { BadRequestException, Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLogsExamples } from './examples/audit-logs.example';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { DEFAULT_SKIP, DEFAULT_LIMIT } from '../../../constants/pagination.constant';

describe('#AuditLogs.AuditLogsService', () => {
  let service: AuditLogsService;
  let auditLogsModel: Model<AuditLog>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: Logger;

  const mockAuditLogsService = {
    create: vi.fn(),
    find: vi.fn().mockReturnThis(),
    exec: vi.fn(),
    findById: vi.fn().mockReturnThis(),
    findByIdAndUpdate: vi.fn().mockReturnThis(),
    aggregate: vi.fn(),
  };

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
        AuditLogsService,
        { provide: getModelToken(AuditLog.name), useValue: mockAuditLogsService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<AuditLogsService>(AuditLogsService);
    auditLogsModel = module.get(getModelToken(AuditLog.name));
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.create', () => {
    it('should create an audit log with valid request body', async () => {
      const createAuditLogDto: CreateAuditLogDto = AuditLogsExamples.create.ok.body;
      const expectedOutput = AuditLogsExamples.create.ok.expected.output;

      vi.spyOn(auditLogsModel, 'create').mockResolvedValueOnce([
        expectedOutput as unknown as AuditLogDocument,
      ]);
      const output = await service.createOneAuditLog(createAuditLogDto);

      expect(output[0]).toEqual(expectedOutput);
    });

    it('should throw a 400 error with an invalid request body', async () => {
      const createAuditLogDto: Partial<CreateAuditLogDto> =
        AuditLogsExamples.create.badRequest.body;

      vi.spyOn(auditLogsModel, 'create').mockImplementation(() => {
        return Promise.reject(new BadRequestException());
      });

      expect(
        async () => await service.createOneAuditLog(createAuditLogDto as CreateAuditLogDto),
      ).rejects.toThrow(new BadRequestException());
    });
  });

  describe('.list', () => {
    it('should return all audit logs successfully', async () => {
      const mockAuditLogs = AuditLogsExamples.list.ok.expected.output;
      const query = {
        cursor: {
          version: 1,
          $skip: DEFAULT_SKIP,
          $limit: DEFAULT_LIMIT,
        },
      };

      mockAuditLogsService.aggregate.mockResolvedValueOnce([
        {
          data: mockAuditLogs,
          totalCount: mockAuditLogs.length,
        },
      ]);
      const result = await service.findAllAuditLogs(query);

      expect(result[0]).toEqual({
        data: mockAuditLogs,
        totalCount: mockAuditLogs.length,
      });
    });
  });
});
