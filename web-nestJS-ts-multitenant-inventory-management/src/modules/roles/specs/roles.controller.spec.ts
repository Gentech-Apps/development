import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from '../roles.controller';
import { RolesService } from '../roles.service';
import { getModelToken } from '@nestjs/mongoose';
import { Role } from '../schema/role.schema';
import { vi } from 'vitest';
import { Logger } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/schema/user.schema';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import { ApiKey } from '../../api-keys/schema/api-key.schema';
import { AuditLogsService } from '../../../shared/modules/audit-logs/audit-logs.service';
import { AuditLog } from '../../../shared/modules/audit-logs/schema/audit-log.schema';

describe('#Roles.RolesController', () => {
  let controller: RolesController;
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
        UsersService,
        ApiKeysService,
        AuditLogsService,
        RolesService,
        { provide: getModelToken(ApiKey.name), useValue: vi.fn() },
        { provide: getModelToken(User.name), useValue: vi.fn() },
        { provide: getModelToken(AuditLog.name), useValue: vi.fn() },
        { provide: getModelToken(Role.name), useValue: vi.fn() },
        { provide: Logger, useValue: mockLogger },
      ],
      controllers: [RolesController],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
