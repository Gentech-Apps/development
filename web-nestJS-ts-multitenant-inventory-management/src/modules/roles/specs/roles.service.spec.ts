import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from '../roles.service';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../../shared/constants/pagination.constant';
import { Role, RoleDocument } from '../schema/role.schema';
import { getModelToken } from '@nestjs/mongoose';
import { RoleExamples } from './examples/role.example';
import { Model } from 'mongoose';
import { BadRequestException, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { vi } from 'vitest';
import { User } from '../../users/schema/user.schema';
import { AssociatedRoleDto } from '../dtos/associated-role.dto';
import { REQUEST } from '@nestjs/core';
import { AuditLogsService } from '../../../shared/modules/audit-logs/audit-logs.service';
import { AuditLog } from '../../../shared/modules/audit-logs/schema/audit-log.schema';

describe('#Roles.RolesService', () => {
  let service: RolesService;
  let rolesModel: Model<Role>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userModel: Model<User>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let logger: Logger;

  const mockRolesService = {
    create: vi.fn(),
    find: vi.fn().mockReturnThis(),
    exec: vi.fn(),
    findById: vi.fn().mockReturnThis(),
    findByIdAndUpdate: vi.fn().mockReturnThis(),
    findOne: vi.fn(),
    aggregate: vi.fn(),
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
        RolesService,
        { provide: getModelToken(Role.name), useValue: mockRolesService },
        { provide: getModelToken(User.name), useValue: vi.fn() },
        { provide: getModelToken(AuditLog.name), useValue: mockAuditLogsService },
        { provide: Logger, useValue: mockLogger },
        { provide: REQUEST, useValue: vi.fn() },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    rolesModel = module.get(getModelToken(Role.name));
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('.create', () => {
    it('should create a role with valid request body', async () => {
      const createRoleDto: CreateRoleDto = RoleExamples.create.ok.body;
      const expectedOutput = RoleExamples.create.ok.expected.output;
      vi.spyOn(rolesModel, 'create').mockResolvedValueOnce([
        expectedOutput as unknown as RoleDocument,
      ]);
      const output = await service.createOneRole(createRoleDto);

      expect(output).toEqual(expectedOutput);
    });

    it('should throw 400 with invalid request body', async () => {
      const createRoleDto: Partial<CreateRoleDto> = RoleExamples.create.badRequest.body;

      vi.spyOn(rolesModel, 'create').mockImplementation(() => {
        return Promise.reject(new BadRequestException());
      });

      expect(
        async () => await service.createOneRole(createRoleDto as CreateRoleDto),
      ).rejects.toThrow(new BadRequestException());
    });
  });

  describe('.list', () => {
    it('should return all roles successfully', async () => {
      const mockRoles = RoleExamples.list.ok.expected.output;

      mockRolesService.aggregate.mockResolvedValueOnce([
        {
          data: mockRoles,
          totalCount: mockRoles.length,
        },
      ]);

      const query = {
        cursor: {
          version: 1,
          $skip: DEFAULT_SKIP,
          $limit: DEFAULT_LIMIT,
        },
      };
      const result = await service.findAllRoles(query);

      expect(result).toEqual({
        data: mockRoles,
        totalCount: mockRoles.length,
      });
    });
  });

  describe('.get', () => {
    it('should return the role by given identifier', async () => {
      const mockRoleId = '672cd0b73aaec5e01a5af312';
      const mockTenantId = '6723257c48b6905036bd656e';
      const mockRole = RoleExamples.get.ok.expected.output as unknown as Role;

      mockRolesService.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([mockRole]),
      });

      const result = await service.findOneRole({ id: mockRoleId, tenantId: mockTenantId });
      expect(result).toEqual(mockRole);
    });

    it('should throw 404 with invalid given identifier', async () => {
      const mockRoleId = '672cd0b73aaec5e01a5af312';

      mockRolesService.find.mockReturnValue({
        exec: vi.fn().mockResolvedValue([]),
      });

      await expect(
        async () => await service.findOneRole({ id: mockRoleId, tenantId: '' }),
      ).rejects.toThrow(
        new NotFoundException(`Record not found with id: 672cd0b73aaec5e01a5af312`),
      );
    });
  });

  describe('.update', () => {
    describe('put', () => {
      it('should update a role by given identifier with valid request body', async () => {
        const mockRoleId = '6723257c48b6905036bd656d';
        const mockTenantId = '6723257c48b6905036bd656d';
        const updateRoleDto = RoleExamples.update.ok.body;
        const mockUpdatedRole = RoleExamples.update.ok.expected.output as unknown as RoleDocument;

        vi.spyOn(rolesModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedRole);

        const result = await service.updateOneRole(
          { id: mockRoleId, tenantId: mockTenantId },
          updateRoleDto,
        );

        expect(result).toEqual(mockUpdatedRole);
      });

      it('should throw 404 with invalid given identifier', async () => {
        const mockRoleId = '6723257c48b6905036bd656d';
        const mockTenantId = '6723257c48b6905036bd656d';
        const updateRoleDto = RoleExamples.update.notFound.body;

        vi.spyOn(rolesModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

        await expect(
          async () =>
            await service.updateOneRole({ id: mockRoleId, tenantId: mockTenantId }, updateRoleDto),
        ).rejects.toThrow(
          new NotFoundException(`Record not found with id: 6723257c48b6905036bd656d`),
        );
      });
    });

    describe('patch', () => {
      it('should patch a role by given identifier with valid request body and update existing scopes', async () => {
        const mockRoleId = '6723257c48b6905036bd656d';
        const mockTenantId = '6723257c48b6905036bd656d';
        const updateRoleDto = RoleExamples.update.patch.ok.body;
        const mockUpdatedRole = RoleExamples.update.patch.ok.expected as unknown as RoleDocument;

        const existingRole = {
          _id: mockRoleId,
          role: 'Super Admin',
          tenantId: mockTenantId,
          scopes: [
            {
              entity: 'tenants',
              read: {
                self: true,
                all: true,
              },
              write: {
                self: true,
                all: true,
              },
            },
          ],
        };

        mockRolesService.find.mockReturnValue({
          exec: vi.fn().mockResolvedValue([existingRole]),
        });
        vi.spyOn(rolesModel, 'findByIdAndUpdate').mockResolvedValueOnce(mockUpdatedRole);

        const result = await service.updateOnePartialRole(
          { id: mockRoleId, tenantId: mockTenantId },
          updateRoleDto,
        );

        expect(result).toEqual(mockUpdatedRole);
      });
    });
  });

  describe('.delete', () => {
    it('should delete the role successfully', async () => {
      const deleteRoleDto = {
        id: '673ef635d667f6efee423050',
        tenantId: '5f93855d942f74000025f075',
      };

      vi.spyOn(service, 'findAssociatedRole').mockResolvedValueOnce(
        'No users associated with the role.',
      );

      const result = await service.deleteOneRole(deleteRoleDto);

      expect(result).toEqual('Record deleted successfully');
      expect(service.findAssociatedRole).toHaveBeenCalledWith({
        id: deleteRoleDto.id,
        tenantId: deleteRoleDto.tenantId,
      });
    });

    it('should throw ConflictException if the role is associated with users', async () => {
      const deleteRoleDto = {
        id: '673ef635d667f6efee423050',
        tenantId: '5f93855d942f74000025f075',
      };
      vi.spyOn(service, 'findAssociatedRole').mockRejectedValueOnce(
        new ConflictException(
          'There are 2 users associated with the role. Please disassociate the users before deleting this role.',
        ),
      );

      await expect(async () => await service.deleteOneRole(deleteRoleDto)).rejects.toThrow(
        new ConflictException(
          'There are 2 users associated with the role. Please disassociate the users before deleting this role.',
        ),
      );
    });

    it('should throw NotFoundException if the role does not exist', async () => {
      const deleteRoleDto = {
        id: '673ef635d667f6efee423050',
        tenantId: '5f93855d942f74000025f075',
      };

      vi.spyOn(service, 'findAssociatedRole').mockResolvedValueOnce(
        'No users associated with the role.',
      );

      vi.spyOn(rolesModel, 'findByIdAndUpdate').mockResolvedValueOnce(null);

      await expect(async () => await service.deleteOneRole(deleteRoleDto)).rejects.toThrow(
        new NotFoundException(`Record not found with id: 673ef635d667f6efee423050`),
      );
    });
  });

  describe('.findAssociatedRole', () => {
    it('should throw ConflictException if users are associated with the role', async () => {
      const associatedRoleDto: AssociatedRoleDto = {
        id: '673ef635d667f6efee423050',
        tenantId: '5f93855d942f74000025f075',
      };

      vi.spyOn(service, 'findAssociatedRole').mockRejectedValueOnce(
        new ConflictException(
          'There are 2 users associated with the role. Please disassociate the users before deleting this role.',
        ),
      );

      await expect(async () => await service.findAssociatedRole(associatedRoleDto)).rejects.toThrow(
        new ConflictException(
          'There are 2 users associated with the role. Please disassociate the users before deleting this role.',
        ),
      );
    });

    it('should return "No users associated with the role." if no users are associated', async () => {
      const associatedRoleDto: AssociatedRoleDto = {
        id: '673ef635d667f6efee423050',
        tenantId: '5f93855d942f74000025f075',
      };

      vi.spyOn(service, 'findAssociatedRole').mockResolvedValueOnce(
        'No users associated with the role.',
      );

      const result = await service.findAssociatedRole(associatedRoleDto);
      expect(result).toBe('No users associated with the role.');
    });
  });
});
