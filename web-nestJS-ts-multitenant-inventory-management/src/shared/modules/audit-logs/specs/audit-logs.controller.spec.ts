import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogsController } from '../audit-logs.controller';
import { AuditLogsService } from '../audit-logs.service';
import { vi } from 'vitest';
import { Logger } from '@nestjs/common';
import { RolesService } from '../../../../modules/roles/roles.service';
import { UsersService } from '../../../../modules/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { ApiKeysService } from '../../../../modules/api-keys/api-keys.service';
import { ApiKey } from '../../../../modules/api-keys/schema/api-key.schema';
import { Role } from '../../../../modules/roles/schema/role.schema';
import { User } from '../../../../modules/users/schema/user.schema';
import { AuditLog } from '../schema/audit-log.schema';

describe('AuditLogsController', () => {
  let controller: AuditLogsController;
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
        RolesService,
        ApiKeysService,
        { provide: getModelToken(ApiKey.name), useValue: vi.fn() },
        { provide: getModelToken(User.name), useValue: vi.fn() },
        { provide: getModelToken(Role.name), useValue: vi.fn() },
        AuditLogsService,
        { provide: getModelToken(AuditLog.name), useValue: vi.fn() },
        { provide: Logger, useValue: mockLogger },
      ],
      controllers: [AuditLogsController],
    }).compile();

    controller = module.get<AuditLogsController>(AuditLogsController);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
