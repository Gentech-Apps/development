import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogsService } from '../activity-logs.service';
import { ActivityLog, ActivityLogDocument } from '../schema/activity-log.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CreateActivityLogDto } from '../dtos/create-activity-log.dto';
import { vi } from 'vitest';
import { ActivityLogExamples } from './examples/activity-log.example';
import { REQUEST } from '@nestjs/core';
import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { DEFAULT_SKIP, DEFAULT_LIMIT } from '../../../constants/pagination.constant';
import { AuditLog } from '../../audit-logs/schema/audit-log.schema';

describe('#ActivityLogs.ActivityLogsService', () => {
  let service: ActivityLogsService;
  let activityLogsModel: Model<ActivityLog>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: Logger;

  const mockActivityLogsService = {
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

  const mockAuditLogsService = {
    create: vi.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogsService,
        ActivityLogsService,
        { provide: getModelToken(AuditLog.name), useValue: mockAuditLogsService },
        { provide: getModelToken(ActivityLog.name), useValue: mockActivityLogsService },
        { provide: Logger, useValue: mockLogger },
        { provide: REQUEST, useValue: vi.fn() },
      ],
    }).compile();

    logger = module.get<Logger>(Logger);
    service = module.get<ActivityLogsService>(ActivityLogsService);
    activityLogsModel = module.get(getModelToken(ActivityLog.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.create', () => {
    it('should create an activity log with valid request body', async () => {
      const createActivityLogDto: CreateActivityLogDto = ActivityLogExamples.create.ok.body;
      const expectedOutput = ActivityLogExamples.create.ok.expected.output;

      vi.spyOn(activityLogsModel, 'create').mockResolvedValueOnce([
        expectedOutput as unknown as ActivityLogDocument,
      ]);
      const output = await service.createOneActivityLog(createActivityLogDto);

      expect(output[0]).toEqual(expectedOutput);
    });

    it('should throw a 400 error with an invalid request body', async () => {
      const createActivityLogDto: Partial<CreateActivityLogDto> =
        ActivityLogExamples.create.badRequest.body;

      vi.spyOn(activityLogsModel, 'create').mockImplementation(() => {
        return Promise.reject(new BadRequestException());
      });

      expect(
        async () =>
          await service.createOneActivityLog(createActivityLogDto as CreateActivityLogDto),
      ).rejects.toThrow(new BadRequestException());
    });
  });

  describe('.list', () => {
    it('should return all activity logs successfully', async () => {
      const mockActivityLogs = ActivityLogExamples.list.ok.expected.output;
      const query = {
        cursor: {
          version: 1,
          $skip: DEFAULT_SKIP,
          $limit: DEFAULT_LIMIT,
        },
      };

      mockActivityLogsService.aggregate.mockResolvedValueOnce({
        data: mockActivityLogs,
        totalCount: mockActivityLogs.length,
      });
      const result = await service.findAllActivityLogs(query);

      expect(result).toEqual({
        data: mockActivityLogs,
        totalCount: mockActivityLogs.length,
      });
    });
  });

  describe('.get', () => {
    it('should return the activity log by given identifier', async () => {
      const mockActivityLogId = '6723257c48b6905036bd656d';
      const mockTenantId = '6723257c48b6905036bd656e';
      const mockActivityLog = ActivityLogExamples.get.ok.expected.output as unknown as ActivityLog;

      mockActivityLogsService.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([mockActivityLog]),
      });

      const result = await service.findOneActivityLog({
        id: mockActivityLogId,
        tenantId: mockTenantId,
      });
      expect(result).toEqual(mockActivityLog);
    });

    it('should throw 404 with invalid given identifier', async () => {
      const mockActivityLogId = '6723257c48b6905036bd656d';

      mockActivityLogsService.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([]),
      });

      await expect(
        async () => await service.findOneActivityLog({ id: mockActivityLogId, tenantId: '' }),
      ).rejects.toThrow(
        new NotFoundException(`Record not found with id: 6723257c48b6905036bd656d`),
      );
    });
  });
});
