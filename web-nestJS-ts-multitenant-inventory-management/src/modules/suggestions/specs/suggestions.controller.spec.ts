import { Test, TestingModule } from '@nestjs/testing';
import { SuggestionsController } from '../suggestions.controller';
import { SuggestionsService } from '../suggestions.service';
import { vi } from 'vitest';
import { Logger } from '@nestjs/common';
import { Suggestion } from '../schema/suggestion.schema';
import { getModelToken } from '@nestjs/mongoose';
import { RolesService } from '../../roles/roles.service';
import { UsersService } from '../../users/users.service';
import { Role } from '../../roles/schema/role.schema';
import { User } from '../../users/schema/user.schema';
import { ApiKeysService } from '../../api-keys/api-keys.service';
import { ApiKey } from '../../api-keys/schema/api-key.schema';
import { AuditLogsService } from '../../../shared/modules/audit-logs/audit-logs.service';
import { AuditLog } from '../../../shared/modules/audit-logs/schema/audit-log.schema';

describe('#Suggestions.SuggestionsController', () => {
  let controller: SuggestionsController;
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
        AuditLogsService,
        { provide: getModelToken(ApiKey.name), useValue: vi.fn() },
        { provide: getModelToken(User.name), useValue: vi.fn() },
        { provide: getModelToken(Role.name), useValue: vi.fn() },
        { provide: getModelToken(AuditLog.name), useValue: vi.fn() },
        { provide: getModelToken(Suggestion.name), useValue: vi.fn() },
        { provide: Logger, useValue: mockLogger },
        SuggestionsService,
      ],
      controllers: [SuggestionsController],
    }).compile();

    controller = module.get<SuggestionsController>(SuggestionsController);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
