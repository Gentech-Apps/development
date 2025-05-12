import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogsController } from '../activity-logs.controller';
import { ActivityLogsService } from '../activity-logs.service';
import { getModelToken } from '@nestjs/mongoose';
import { ActivityLog } from '../schema/activity-log.schema';
import { vi } from 'vitest';
import { Logger } from '@nestjs/common';
import { ApiKeysService } from '../../../../modules/api-keys/api-keys.service';
import { ApiKey } from '../../../../modules/api-keys/schema/api-key.schema';
import { RolesService } from '../../../../modules/roles/roles.service';
import { Role } from '../../../../modules/roles/schema/role.schema';
import { User } from '../../../../modules/users/schema/user.schema';
import { UsersService } from '../../../../modules/users/users.service';
import { AuditLogsService } from '../../audit-logs/audit-logs.service';
import { AuditLog } from '../../audit-logs/schema/audit-log.schema';

describe('#ActivityLogs.ActivityLogsController', () => {
  let controller: ActivityLogsController;
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
        UsersService,
        RolesService,
        ApiKeysService,
        { provide: getModelToken(AuditLog.name), useValue: vi.fn() },
        { provide: getModelToken(ApiKey.name), useValue: vi.fn() },
        { provide: getModelToken(User.name), useValue: vi.fn() },
        { provide: getModelToken(Role.name), useValue: vi.fn() },
        ActivityLogsService,
        { provide: getModelToken(ActivityLog.name), useValue: vi.fn() },
        { provide: Logger, useValue: mockLogger },
      ],
      controllers: [ActivityLogsController],
    }).compile();

    controller = module.get<ActivityLogsController>(ActivityLogsController);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
