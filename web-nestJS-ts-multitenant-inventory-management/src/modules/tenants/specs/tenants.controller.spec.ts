import { Test, TestingModule } from '@nestjs/testing';
import { TenantsController } from '../tenants.controller';
import { getModelToken } from '@nestjs/mongoose';
import { Tenant } from '../schema/tenant.schema';
import { ConfigService } from '@nestjs/config';
import { vi } from 'vitest';
import { Logger } from '@nestjs/common';
import { TenantsService } from '../tenants.service';
import { RolesService } from '../../roles/roles.service';
import { UsersService } from '../../users/users.service';
import { TenantsOperationService } from '../tenants.operation.service';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import { ApiKey } from '../../api-keys/schema/api-key.schema';
import { AuditLogsService } from '../../../shared/modules/audit-logs/audit-logs.service';
import { AuditLog } from '../../../shared/modules/audit-logs/schema/audit-log.schema';

describe('#Tenants.TenantsController', () => {
  let controller: TenantsController;
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
        AuditLogsService,
        ApiKeysService,
        { provide: getModelToken(AuditLog.name), useValue: vi.fn() },
        { provide: getModelToken(ApiKey.name), useValue: vi.fn() },
        TenantsService,
        { provide: getModelToken(Tenant.name), useValue: vi.fn() },
        ConfigService,
        { provide: RolesService, useValue: vi.fn() },
        { provide: UsersService, useValue: vi.fn() },
        { provide: TenantsOperationService, useValue: vi.fn() },
        { provide: Logger, useValue: mockLogger },
      ],
      controllers: [TenantsController],
    }).compile();

    controller = module.get<TenantsController>(TenantsController);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
