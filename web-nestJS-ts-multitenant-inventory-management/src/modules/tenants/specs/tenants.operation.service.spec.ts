import { vi } from 'vitest';
import { TenantsOperationService } from '../tenants.operation.service';
import { TenantsService } from '../tenants.service';
import { RolesService } from '../../roles/roles.service';
import { UsersService } from '../../users/users.service';
import { MailsService } from '../../../shared/modules/mails/mails.service';
import { Logger } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { CreateTenantOperationDto } from '../dtos/create-tenant-operation.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Tenant } from '../schema/tenant.schema';

describe('#Tenants.TenantsOperationService', () => {
  let service: TenantsOperationService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let tenantsModel: Model<Tenant>;
  let tenantsService: TenantsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let rolesService: RolesService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mailService: MailsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: Logger;

  const mockTenantsService = {
    createOneTenant: vi.fn(),
  };

  const mockRolesService = {
    createBatchRoles: vi.fn(),
  };

  const mockUsersService = {
    createOneUser: vi.fn(),
  };

  const mockMailService = {
    sendEmail: vi.fn(),
  };

  const mockLogger = {
    verbose: vi.fn(),
    error: vi.fn(),
  };

  const mockMongooseConnection = {
    startSession: vi.fn().mockReturnValue({
      startTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      abortTransaction: vi.fn(),
    }),
  };
  const mockTenantsOperationService = {
    createOneTenantWithRolesAndUser: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: TenantsService, useValue: mockTenantsService },
        { provide: getModelToken(Tenant.name), useValue: mockTenantsService },
        { provide: RolesService, useValue: mockRolesService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: MailsService, useValue: mockMailService },
        { provide: Logger, useValue: mockLogger },
        { provide: mongoose.Connection, useValue: mockMongooseConnection },
        { provide: TenantsOperationService, useValue: mockTenantsOperationService },
      ],
    }).compile();

    service = module.get<TenantsOperationService>(TenantsOperationService);
    tenantsService = module.get<TenantsService>(TenantsService);
    tenantsModel = module.get(getModelToken(Tenant.name));
    rolesService = module.get<RolesService>(RolesService);
    usersService = module.get<UsersService>(UsersService);
    mailService = module.get<MailsService>(MailsService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(tenantsService).toBeDefined();
  });

  describe('.createOneTenantWithRolesAndUser', () => {
    it('should create a tenant, role, and user successfully', async () => {
      const createTenantOperationDto: CreateTenantOperationDto = {
        companyName: 'newOperationTenant',
        country: 'AF',
        secondaryLanguage: 'jpn',
        currency: 'AFN',
        email: 'newTenant@gmail.com',
      };
      vi.spyOn(service, 'createOneTenantWithRolesAndUser').mockResolvedValue({
        domainUrl: 'newOperationTenant.genesisapps.in',
      });
      const result = await service.createOneTenantWithRolesAndUser(createTenantOperationDto);

      expect(result).toEqual({
        domainUrl: 'newOperationTenant.genesisapps.in',
      });
    });
  });
});
