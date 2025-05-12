import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { User } from '../schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { vi } from 'vitest';
import { Logger } from '@nestjs/common';
import { Role } from '../../roles/schema/role.schema';
import { RolesService } from '../../roles/roles.service';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import { ApiKey } from '../../api-keys/schema/api-key.schema';
import { AuditLogsService } from '../../../shared/modules/audit-logs/audit-logs.service';
import { AuditLog } from '../../../shared/modules/audit-logs/schema/audit-log.schema';

//We should only provide relative paths only
//We should provide dependent services before its own services in before each function
//We should provide dependent services before the getModelToken
//In getModelToken we can either give mockservice or vi.fn()

describe('#Users.UsersController', () => {
  let controller: UsersController;
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
      controllers: [UsersController],
      providers: [
        RolesService,
        ApiKeysService,
        AuditLogsService,
        { provide: getModelToken(ApiKey.name), useValue: vi.fn() },
        { provide: getModelToken(Role.name), useValue: vi.fn() },
        { provide: getModelToken(AuditLog.name), useValue: vi.fn() },
        UsersService,
        { provide: getModelToken(User.name), useValue: vi.fn() },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
