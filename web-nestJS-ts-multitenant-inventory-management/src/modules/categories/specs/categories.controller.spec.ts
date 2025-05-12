import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Category } from '../schema/category.schema';
import { vi } from 'vitest';
import { Logger } from '@nestjs/common';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../categories.service';
import { RolesService } from '../../roles/roles.service';
import { Role } from '../../roles/schema/role.schema';
import { User } from '../../users/schema/user.schema';
import { UsersService } from '../../users/users.service';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import { ApiKey } from '../../api-keys/schema/api-key.schema';
import { AuditLogsService } from '../../../shared/modules/audit-logs/audit-logs.service';
import { AuditLog } from '../../../shared/modules/audit-logs/schema/audit-log.schema';

describe('#Categories.CategoriesController', () => {
  let controller: CategoriesController;
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
        RolesService,
        UsersService,
        ApiKeysService,
        AuditLogsService,
        { provide: getModelToken(ApiKey.name), useValue: vi.fn() },
        { provide: getModelToken(User.name), useValue: vi.fn() },
        { provide: getModelToken(Role.name), useValue: vi.fn() },
        { provide: getModelToken(AuditLog.name), useValue: vi.fn() },
        CategoriesService,
        { provide: getModelToken(Category.name), useValue: vi.fn() },
        { provide: Logger, useValue: mockLogger },
      ],
      controllers: [CategoriesController],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
