import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionsService } from '../suggestions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Suggestion, SuggestionDocument } from '../schema/suggestion.schema';
import { Model } from 'mongoose';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CreateSuggestionDto } from '../dtos/create-suggestion.dto';
import { SuggestionExamples } from './examples/suggestion.example';
import { vi } from 'vitest';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../shared/constants/pagination.constant';
import { AuditLog } from '../../../shared/modules/audit-logs/schema/audit-log.schema';
import { REQUEST } from '@nestjs/core';
import { AuditLogsService } from '../../../shared/modules/audit-logs/audit-logs.service';

describe('#Suggestions.SuggestionsService', () => {
  let service: SuggestionsService;
  let suggestionModel: Model<Suggestion>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: Logger;

  const mockSuggestionService = {
    create: vi.fn(),
    find: vi.fn().mockReturnThis(),
    exec: vi.fn(),
    findById: vi.fn().mockReturnThis(),
    findByIdAndUpdate: vi.fn().mockReturnThis(),
    aggregate: vi.fn(),
    watch: vi.fn().mockReturnThis(),
    on: vi.fn(),
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
        SuggestionsService,
        { provide: getModelToken(AuditLog.name), useValue: mockAuditLogsService },
        { provide: getModelToken(Suggestion.name), useValue: mockSuggestionService },
        { provide: Logger, useValue: mockLogger },
        { provide: REQUEST, useValue: vi.fn() },
      ],
    }).compile();

    service = module.get<SuggestionsService>(SuggestionsService);
    suggestionModel = module.get(getModelToken(Suggestion.name));
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.create', () => {
    it('should create a suggestion with valid request body', async () => {
      const createSuggestionDto: CreateSuggestionDto = SuggestionExamples.create.ok.body;
      const expectedOutput = SuggestionExamples.create.ok.expected.output;

      vi.spyOn(suggestionModel, 'create').mockResolvedValueOnce([
        expectedOutput as unknown as SuggestionDocument,
      ]);
      const output = await service.createOneSuggestion(createSuggestionDto);

      expect(output).toEqual(expectedOutput);
    });

    it('should throw 400 with invalid request body', async () => {
      const createSuggestionDto: Partial<CreateSuggestionDto> =
        SuggestionExamples.create.badRequest.body;

      vi.spyOn(suggestionModel, 'create').mockImplementation(() => {
        throw new BadRequestException();
      });

      await expect(
        service.createOneSuggestion(createSuggestionDto as CreateSuggestionDto),
      ).rejects.toThrow(new BadRequestException());
    });
  });

  describe('.list', () => {
    it('should return all suggestions successfully', async () => {
      const mockSuggestions = SuggestionExamples.list.ok.expected.output;

      mockSuggestionService.aggregate.mockResolvedValueOnce([
        {
          data: mockSuggestions,
          totalCount: mockSuggestions.length,
        },
      ]);

      const query = {
        cursor: {
          version: 1,
          $skip: DEFAULT_SKIP,
          $limit: DEFAULT_LIMIT,
        },
      };
      const result = await service.findAllSuggestions(query);

      expect(result).toEqual({
        data: mockSuggestions,
        totalCount: mockSuggestions.length,
      });
    });
  });

  describe('.get', () => {
    it('should return the suggestion by given identifier', async () => {
      const mockSuggestionId = '673ec4d7f64086f8b656e7bc';
      const mockTenantId = '6723257c48b6905036bd656e';
      const mockSuggestion = SuggestionExamples.get.ok.expected.output as unknown as Suggestion;

      mockSuggestionService.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([mockSuggestion]),
      });

      const result = await service.findOneSuggestion({
        id: mockSuggestionId,
        tenantId: mockTenantId,
      });
      expect(result).toEqual(mockSuggestion);
    });

    it('should throw 404 with invalid given identifier', async () => {
      const mockSuggestionId = '672cd0b73aaec5e01a5af312';

      mockSuggestionService.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([]),
      });

      await expect(
        async () => await service.findOneSuggestion({ id: mockSuggestionId, tenantId: '' }),
      ).rejects.toThrow(
        new NotFoundException(`Record not found with id: 672cd0b73aaec5e01a5af312`),
      );
    });
  });

  describe('.update', () => {
    it('should update a Suggestion by given identifier with valid request body', async () => {
      const mockSuggestionId = '6723257c48b6905036bd656d';
      const mockTenantId = '6735ff7225b315c04d0ffd90';
      const updateSuggestionDto = SuggestionExamples.update.ok.body;
      const mockUpdatedSuggestion = SuggestionExamples.update.ok.expected
        .output as unknown as SuggestionDocument;

      vi.spyOn(suggestionModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedSuggestion);

      const result = await service.updateOneSuggestion(
        { id: mockSuggestionId, tenantId: mockTenantId },
        updateSuggestionDto,
      );

      expect(result).toEqual(mockUpdatedSuggestion);
    });

    it('should throw 404 with invalid given identifier', async () => {
      const mockSuggestionId = '6723257c48b6905036bd656d';
      const mockTenantId = '6735ff7225b315c04d0ffd90';
      const updateSuggestionDto = SuggestionExamples.update.notFound.body;

      vi.spyOn(suggestionModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

      await expect(
        async () =>
          await service.updateOneSuggestion(
            { id: mockSuggestionId, tenantId: mockTenantId },
            updateSuggestionDto,
          ),
      ).rejects.toThrow(
        new NotFoundException(`Record not found with id: 6723257c48b6905036bd656d`),
      );
    });
  });
});
