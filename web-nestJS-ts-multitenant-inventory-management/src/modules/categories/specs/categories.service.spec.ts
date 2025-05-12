import { Test, TestingModule } from '@nestjs/testing';
import { Category, CategoryDocument } from '../schema/category.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { CategoryExamples } from './examples/category.example';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { vi } from 'vitest';
import { CategoriesService } from '../categories.service';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../shared/constants/pagination.constant';
import { AuditLogsService } from '../../../shared/modules/audit-logs/audit-logs.service';
import { AuditLog } from '../../../shared/modules/audit-logs/schema/audit-log.schema';
import { REQUEST } from '@nestjs/core';

describe('#Categories.CategoriesService', () => {
  let service: CategoriesService;
  let categoryModel: Model<Category>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: Logger;

  const mockCategoryService = {
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
        CategoriesService,
        { provide: getModelToken(AuditLog.name), useValue: mockAuditLogsService },
        { provide: getModelToken(Category.name), useValue: mockCategoryService },
        { provide: Logger, useValue: mockLogger },
        { provide: REQUEST, useValue: vi.fn() },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryModel = module.get(getModelToken(Category.name));
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.create', () => {
    it('should create a category with valid request body', async () => {
      const createCategoryDto: CreateCategoryDto = CategoryExamples.create.ok.body;
      const expectedOutput = CategoryExamples.create.ok.expected;
      vi.spyOn(categoryModel, 'create').mockResolvedValueOnce([
        expectedOutput as unknown as CategoryDocument,
      ]);

      const output = await service.createOneCategory(createCategoryDto);
      expect(output).toEqual(expectedOutput);
    });

    it('should throw 400 with invalid request body', () => {
      const createCategoryDto: Partial<CreateCategoryDto> = CategoryExamples.create.badRequest.body;

      vi.spyOn(categoryModel, 'create').mockImplementation(() => {
        return Promise.reject(new BadRequestException());
      });

      expect(
        async () => await service.createOneCategory(createCategoryDto as CreateCategoryDto),
      ).rejects.toThrow(new BadRequestException());
    });
  });

  describe('.list', () => {
    it('should return all categories successfully', async () => {
      const mockCategories = CategoryExamples.list.ok.expected.output;
      const query = {
        cursor: {
          version: 1,
          $skip: DEFAULT_SKIP,
          $limit: DEFAULT_LIMIT,
        },
      };

      mockCategoryService.aggregate.mockResolvedValueOnce([
        {
          data: mockCategories,
          totalCount: mockCategories.length,
        },
      ]);

      const result = await service.findAllCategories(query);

      expect(result).toEqual({
        data: mockCategories,
        totalCount: mockCategories.length,
      });
    });
  });

  describe('.get', () => {
    it('should return the category by given identifier', async () => {
      const mockCategoryId = '6723257c48b6905036bd656d';
      const mockTenantId = '6723257c48b6905036bd656e';
      const mockCategory = CategoryExamples.get.ok.expected.output as unknown as Category;

      mockCategoryService.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([mockCategory]),
      });

      const result = await service.findOneCategory({ id: mockCategoryId, tenantId: mockTenantId });
      expect(result).toEqual(mockCategory);
    });

    it('should throw 404 with invalid given identifier', async () => {
      const mockCategoryId = '6723257c48b6905036bd656d';

      vi.spyOn(categoryModel, 'find').mockReturnValueOnce({
        exec: vi.fn().mockResolvedValue([]),
      } as any);

      await expect(
        async () => await service.findOneCategory({ id: mockCategoryId, tenantId: '' }),
      ).rejects.toThrow(
        new NotFoundException(`Record not found with id: 6723257c48b6905036bd656d`),
      );
    });
  });

  describe('.update', () => {
    it('should update a category with valid request body', async () => {
      const mockCategoryId = '6723257c48b6905036bd656d';
      const mockTenantId = '6723257c48b6905036bd656d';
      const updateCategoryDto = CategoryExamples.update.ok.body;
      const mockResponse = CategoryExamples.update.ok.expected;

      vi.spyOn(categoryModel, 'findByIdAndUpdate').mockResolvedValue(mockResponse);

      const result = await service.updateOneCategory(
        { id: mockCategoryId, tenantId: mockTenantId },
        updateCategoryDto,
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error with invalid request body', async () => {
      const mockCategoryId = '6723257c48b6905036bd656d';
      const mockTenantId = '6723257c48b6905036bd656d';
      const updateCategoryDto: Partial<UpdateCategoryDto> = CategoryExamples.update.badRequest.body;
      vi.spyOn(categoryModel, 'findByIdAndUpdate').mockRejectedValueOnce(new BadRequestException());
      await expect(
        service.updateOneCategory(
          { id: mockCategoryId, tenantId: mockTenantId },
          updateCategoryDto as UpdateCategoryDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
