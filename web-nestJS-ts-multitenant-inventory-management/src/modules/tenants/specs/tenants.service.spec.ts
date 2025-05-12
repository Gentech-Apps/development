import { Test, TestingModule } from '@nestjs/testing';
import { TenantsService } from '../tenants.service';
import { getModelToken } from '@nestjs/mongoose';
import { Tenant, TenantDocument } from '../schema/tenant.schema';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTenantDto } from '../dtos/create-tenant.dto';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../shared/constants/pagination.constant';
import { TenantExamples } from './examples/tenant.example';
import { vi } from 'vitest';
import { AuditLog } from '../../../shared/modules/audit-logs/schema/audit-log.schema';
import { AuditLogsService } from '../../../shared/modules/audit-logs/audit-logs.service';
import { UsersService } from '../../users/users.service';
import { RolesService } from '../../roles/roles.service';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import { ApiKey } from '../../api-keys/schema/api-key.schema';
import { User } from '../../users/schema/user.schema';
import { Role } from '../../roles/schema/role.schema';
import { REQUEST } from '@nestjs/core';

describe('#Tenants.TenantsService', () => {
  let service: TenantsService;
  let tenantsModel: Model<Tenant>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: Logger;

  const mockTenantsService = {
    create: vi.fn(),
    find: vi.fn().mockReturnThis(),
    exec: vi.fn(),
    findById: vi.fn().mockReturnThis(),
    findByIdAndUpdate: vi.fn().mockReturnThis(),
    aggregate: vi.fn(),
    watch: vi.fn().mockReturnThis(),
    on: vi.fn(),
    createOneAuditLog: vi.fn(),
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
        UsersService,
        RolesService,
        ApiKeysService,
        AuditLogsService,
        TenantsService,
        { provide: getModelToken(User.name), useValue: vi.fn() },
        { provide: getModelToken(Role.name), useValue: vi.fn() },
        { provide: getModelToken(ApiKey.name), useValue: vi.fn() },
        { provide: getModelToken(AuditLog.name), useValue: mockAuditLogsService },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue('genesisapps.in'),
          },
        },
        { provide: REQUEST, useValue: vi.fn() },
        { provide: getModelToken(Tenant.name), useValue: mockTenantsService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<TenantsService>(TenantsService);
    tenantsModel = module.get(getModelToken(Tenant.name));
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.create', () => {
    it('should create a tenant with valid request body', async () => {
      const createTenantDto: CreateTenantDto = TenantExamples.create.ok.body;
      const expectedOutput = TenantExamples.create.ok.expected.output;

      vi.spyOn(tenantsModel, 'create').mockResolvedValueOnce([
        expectedOutput as unknown as TenantDocument,
      ]);
      const output = await service.createOneTenant(createTenantDto);

      expect(output).toEqual(expectedOutput);
    });

    it('should throw 400 with invalid request body', () => {
      const createTenantDto: Partial<CreateTenantDto> = TenantExamples.create.badRequest.body;

      vi.spyOn(tenantsModel, 'create').mockImplementation(() => {
        return Promise.reject(new BadRequestException());
      });

      expect(
        async () => await service.createOneTenant(createTenantDto as CreateTenantDto),
      ).rejects.toThrow(new BadRequestException());
    });

    it('should throw Error when baseDomainUrl is missing or empty', async () => {
      vi.spyOn(service['configService'], 'get').mockReturnValueOnce('');

      const createTenantDto: CreateTenantDto = TenantExamples.create.ok.body;

      await expect(async () => await service.createOneTenant(createTenantDto)).rejects.toThrow(
        new UnprocessableEntityException('Unable to register the tenant'),
      );
    });
  });

  describe('.list', () => {
    it('should return all tenants successfully', async () => {
      const mockTenants = TenantExamples.list.ok.expected.output;
      const query = {
        cursor: {
          version: 1,
          $skip: DEFAULT_SKIP,
          $limit: DEFAULT_LIMIT,
        },
      };

      mockTenantsService.aggregate.mockResolvedValueOnce([
        {
          data: mockTenants,
          totalCount: mockTenants.length,
        },
      ]);

      const result = await service.findAllTenants(query);

      expect(result).toEqual({
        data: mockTenants,
        totalCount: mockTenants.length,
      });
    });
  });

  describe('.get', () => {
    it('should return the tenant by given identifier', async () => {
      const mockTenantId = '6723257c48b6905036bd656d';
      const mockTenant = TenantExamples.get.ok.expected.output as unknown as Tenant;

      mockTenantsService.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([mockTenant]),
      });

      const result = await service.findOneTenant(mockTenantId);
      expect(result).toEqual(mockTenant);
    });

    it('should throw 404 with invalid given identifier', async () => {
      const mockTenantId = '6723257c48b6905036bd656d';

      mockTenantsService.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([]),
      });

      await expect(async () => await service.findOneTenant(mockTenantId)).rejects.toThrow(
        new NotFoundException(`Record not found with id: 6723257c48b6905036bd656d`),
      );
    });
  });

  describe('.update', () => {
    it('should update a tenant by given identifier with valid request body', async () => {
      const mockTenantId = '6723257c48b6905036bd656d';
      const updateTenantDto = TenantExamples.update.ok.body;
      const mockUpdatedTenant = TenantExamples.update.ok.expected
        .output as unknown as TenantDocument;

      vi.spyOn(tenantsModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedTenant);

      const result = await service.updateOneTenant(mockTenantId, updateTenantDto);

      expect(result).toEqual(mockUpdatedTenant);
    });

    it('should throw 404 with invalid given identifier', async () => {
      const mockTenantId = '6723257c48b6905036bd656d';
      const updateTenantDto = TenantExamples.update.notFound.body;

      vi.spyOn(tenantsModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

      await expect(
        async () => await service.updateOneTenant(mockTenantId, updateTenantDto),
      ).rejects.toThrow(
        new NotFoundException(`Record not found with id: 6723257c48b6905036bd656d`),
      );
    });
  });

  describe('.delete', () => {
    it('should delete the tenant successfully', async () => {
      const deleteTenantDto = {
        id: '673ef635d667f6efee423050',
        tenantId: '5f93855d942f74000025f075',
      };

      const result = await service.deleteOneTenant(deleteTenantDto);
      expect(result).toEqual('Record deleted successfully');
    });

    it('should throw NotFoundException if the tenant does not exist', async () => {
      const deleteTenantDto = {
        id: '673ef635d667f6efee423050',
        tenantId: '5f93855d942f74000025f075',
      };
      vi.spyOn(tenantsModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

      await expect(async () => await service.deleteOneTenant(deleteTenantDto)).rejects.toThrow(
        new NotFoundException(`Record not found with id: 673ef635d667f6efee423050`),
      );
    });
  });

  describe('.findOneTenantByCompanyName', () => {
    it('should return the tenant when the company name exists', async () => {
      const companyName = 'TestCompany';
      const mockTenant = {
        _id: '6723257c48b6905036bd656d',
        domainUrl: 'TestCompany.genesisapps.in',
        isDeleted: false,
        isActive: true,
      };

      mockTenantsService.aggregate.mockResolvedValueOnce([{ data: [mockTenant] }]);

      const result = await service.findOneTenantByCompanyName({ companyName });
      console.log('resukt: ', result);

      expect(result).toEqual(mockTenant);
    });

    it('should throw UnauthorizedException when the company name does not exist', async () => {
      const companyName = 'NonExistentCompany';

      vi.spyOn(service['unifiedOperationService'], 'handleOperation').mockResolvedValueOnce({
        data: [],
      });

      await expect(service.findOneTenantByCompanyName({ companyName })).rejects.toThrowError(
        new NotFoundException(`Tenant doesn't exist`),
      );
    });
  });
});
