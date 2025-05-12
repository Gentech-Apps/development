import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../shared/constants/pagination.constant';
import { UserExamples } from './examples/user.example';
import { vi } from 'vitest';
import { AuditLogsService } from '../../../shared/modules/audit-logs/audit-logs.service';
import { AuditLog } from '../../../shared/modules/audit-logs/schema/audit-log.schema';
import { REQUEST } from '@nestjs/core';

describe('#Users.UsersService', () => {
  let service: UsersService;
  let usersModel: Model<User>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: Logger;

  const mockUsersService = {
    create: vi.fn(),
    find: vi.fn().mockReturnThis(),
    exec: vi.fn(),
    findById: vi.fn().mockReturnThis(),
    findByIdAndUpdate: vi.fn().mockReturnThis(),
    aggregate: vi.fn(),
    findOne: vi.fn(),
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
        UsersService,
        { provide: getModelToken(AuditLog.name), useValue: mockAuditLogsService },
        { provide: getModelToken(User.name), useValue: mockUsersService },
        { provide: Logger, useValue: mockLogger },
        { provide: REQUEST, useValue: vi.fn() },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersModel = module.get(getModelToken(User.name));
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.create', () => {
    it('should create a user with valid request body', async () => {
      const createUserDto: CreateUserDto = UserExamples.create.ok.body;
      const expectedOutput = UserExamples.create.ok.expected.output;

      vi.spyOn(usersModel, 'create').mockResolvedValueOnce([
        expectedOutput as unknown as UserDocument,
      ]);
      const output = await service.createOneUser(createUserDto);

      expect(output).toEqual(expectedOutput);
    });

    it('should throw 400 with invalid request body', () => {
      const createUserDto: Partial<CreateUserDto> = UserExamples.create.badRequest.body;

      vi.spyOn(usersModel, 'create').mockImplementation(() => {
        return Promise.reject(new BadRequestException());
      });

      expect(
        async () => await service.createOneUser(createUserDto as CreateUserDto),
      ).rejects.toThrow(new BadRequestException());
    });
  });

  describe('.list', () => {
    it('should return all Users successfully', async () => {
      const mockUsers = UserExamples.list.ok.expected.output;
      const query = {
        cursor: {
          version: 1,
          $skip: DEFAULT_SKIP,
          $limit: DEFAULT_LIMIT,
        },
      };

      mockUsersService.aggregate.mockResolvedValueOnce([
        {
          data: mockUsers,
          totalCount: mockUsers.length,
        },
      ]);

      const result = await service.findAllUsers(query);

      expect(result).toEqual({
        data: mockUsers,
        totalCount: mockUsers.length,
      });
    });
  });

  describe('.get', () => {
    it('should return the User by given identifier', async () => {
      const mockUserId = '6723257c48b6905036bd656d';
      const mockTenantId = '6723257c48b6905036bd656e';
      const mockUser = UserExamples.get.ok.expected.output as unknown as User;

      mockUsersService.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([mockUser]),
      });

      const result = await service.findOneUser({ id: mockUserId, tenantId: mockTenantId });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException for an invalid ID', async () => {
      const mockUserId = '6723257c48b6905036bd';

      vi.spyOn(usersModel, 'find').mockReturnValueOnce({
        exec: vi.fn().mockResolvedValue([]),
      } as any);

      await expect(service.findOneUser({ id: mockUserId, tenantId: '' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('.update', () => {
    it('should update a User by given identifier with valid request body', async () => {
      const mockUserId = '6723257c48b6905036bd656d';
      const mockTenantId = '6723257c48b6905036bd656d';
      const updateUserDto = UserExamples.update.ok.body;
      const mockUpdatedUser = UserExamples.update.ok.expected.output as unknown as UserDocument;

      vi.spyOn(usersModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedUser);

      const result = await service.updateOneUser(
        { id: mockUserId, tenantId: mockTenantId },
        updateUserDto,
      );

      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw 404 with invalid given identifier', async () => {
      const mockUserId = '6723257c48b6905036bd656d';
      const mockTenantId = '6723257c48b6905036bd656d';
      const updateUserDto = UserExamples.update.notFound.body;

      vi.spyOn(usersModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

      await expect(
        async () =>
          await service.updateOneUser({ id: mockUserId, tenantId: mockTenantId }, updateUserDto),
      ).rejects.toThrow(
        new NotFoundException(`Record not found with id: 6723257c48b6905036bd656d`),
      );
    });
  });

  describe('.delete', () => {
    it('should delete the user successfully', async () => {
      const deleteUserDto = {
        id: '673ef635d667f6efee423050',
        tenantId: '5f93855d942f74000025f075',
      };

      const result = await service.deleteOneUser(deleteUserDto);
      expect(result).toEqual('Record deleted successfully');
    });

    it('should throw NotFoundException if the user does not exist', async () => {
      const deleteUserDto = {
        id: '673ef635d667f6efee423050',
        tenantId: '5f93855d942f74000025f075',
      };
      vi.spyOn(usersModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

      await expect(async () => await service.deleteOneUser(deleteUserDto)).rejects.toThrow(
        new NotFoundException(`Record not found with id: 673ef635d667f6efee423050`),
      );
    });
  });

  describe('.validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = UserExamples.validate.ok.expected.output;

      mockUsersService.aggregate.mockResolvedValueOnce([{ data: [mockUser] }]);
      const validateBody = UserExamples.validate.ok.body;

      const result = await service.validateUser({
        email: validateBody.email,
        password: validateBody.password,
        tenantId: validateBody.tenantId,
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when email is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'User@1234';
      const tenantId = '6788a32231f106f00f06f911';

      mockUsersService.aggregate.mockResolvedValueOnce([{ data: [] }]);

      await expect(service.validateUser({ email, password, tenantId })).rejects.toThrow(
        new UnauthorizedException('Email is invalid.'),
      );
    });
  });
});
