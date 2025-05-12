/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { UnifiedListQueryResponseDto } from '../../shared/dto/unified-list-query-response.dto';
import { OperationType } from '../../shared/operations/enums/operation.enum';
import { UnifiedOperationService } from '../../shared/operations/unified-operation';
import { Role, RoleDocument, RoleScopesModel } from './schema/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ListRolesQueryDto } from './dtos/list-role.dto';
import { notMissing } from '../../shared/utils/typecheck';
import { User, UserDocument } from '../users/schema/user.schema';
import { AssociatedRoleDto } from './dtos/associated-role.dto';
import { DeleteRoleDto } from './dtos/delete-role.dto';
import { REQUEST } from '@nestjs/core';
import { AuditLogsService } from '../../shared/modules/audit-logs/audit-logs.service';
import { GetRoleDto } from './dtos/get-role.dto';
import { UpdateRolePathParamDto } from './dtos/update-role-path-param.dto';

@Injectable()
export class RolesService {
  private readonly unifiedOperationService: UnifiedOperationService<RoleDocument>;

  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly auditLogsService: AuditLogsService,
    private readonly logger: Logger,
    @Inject(REQUEST) private request: Request,
  ) {
    this.unifiedOperationService = new UnifiedOperationService<RoleDocument>(
      roleModel,
      request,
      auditLogsService,
    );
  }

  async createOneRole(
    createRoleDto: CreateRoleDto,
    session?: mongoose.ClientSession,
  ): Promise<RoleDocument> {
    try {
      const options = {
        data: {
          ...createRoleDto,
          nameLocale: notMissing(createRoleDto.nameLocale)
            ? createRoleDto.nameLocale
            : createRoleDto.name,
        },
        session,
      };

      await this.unifiedOperationService.recordAlreadyExists({
        tenantId: createRoleDto.tenantId,
        name: createRoleDto.name,
      });

      const createdRole = await this.unifiedOperationService.handleOperation(
        OperationType.CREATE,
        options,
      );
      0;

      return createdRole;
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error creating record',
          message: error.message,
          resource: RolesService.name,
        }),
      );
      throw error;
    }
  }

  async createBatchRoles(
    createRoleDtos: CreateRoleDto[],
    session?: mongoose.ClientSession,
  ): Promise<RoleDocument[]> {
    try {
      const options = {
        data: createRoleDtos.map((role) => ({
          ...role,
        })),
        session,
      };

      const createdRoles = await this.unifiedOperationService.handleOperation(
        OperationType.CREATE_BATCH,
        options,
      );

      return createdRoles;
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error creating records',
          message: error.message,
          resource: RolesService.name,
        }),
      );
      throw error;
    }
  }

  async findAllRoles(query: ListRolesQueryDto): Promise<UnifiedListQueryResponseDto<Role>> {
    try {
      return await this.unifiedOperationService.handleOperation(OperationType.LIST, {
        query,
      });
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error finding record',
          message: error.message,
          resource: RolesService.name,
        }),
      );
      throw error;
    }
  }

  async findOneRole(getRoleDto: GetRoleDto): Promise<RoleDocument> {
    try {
      const options = { id: getRoleDto.id, tenantId: getRoleDto.tenantId };
      return await this.unifiedOperationService.handleOperation(OperationType.GET, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error getting record',
          message: error.message,
          resource: RolesService.name,
        }),
      );
      throw error;
    }
  }

  //INFO: this function returns No users associated with the role message for following cases:
  // 2> No users found with given roleId and tenantId.
  // 1> No user associated with this roleId and tenantId
  async findAssociatedRole(associatedRoleDto: AssociatedRoleDto): Promise<string> {
    const users = await this.userModel
      .find({ roleId: associatedRoleDto.id, tenantId: associatedRoleDto.tenantId })
      .exec();

    if (users.length > 0) {
      throw new ConflictException(
        `There are ${users.length} users associated with the role. Please disassociate the users before deleting this role.`,
      );
    }
    return 'No users associated with the role.';
  }

  async updateOnePartialRole(
    updateRolePathParamDto: UpdateRolePathParamDto,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    try {
      const existingRole = await this.unifiedOperationService.handleOperation(OperationType.GET, {
        id: updateRolePathParamDto.id,
        tenantId: updateRolePathParamDto.tenantId,
      });

      const updatedScopes = [
        ...existingRole.scopes.filter(
          (scope: RoleScopesModel) =>
            !updateRoleDto.scopes.some((newScope) => newScope.entity === scope.entity),
        ),
        ...updateRoleDto.scopes,
      ];

      const options = {
        id: updateRolePathParamDto.id,
        tenantId: updateRolePathParamDto.tenantId,
        ...updateRoleDto,
        scopes: updatedScopes,
      };

      return await this.unifiedOperationService.handleOperation(OperationType.UPDATE, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error updating record',
          message: error.message,
          resource: RolesService.name,
        }),
      );
      throw error;
    }
  }

  async updateOneRole(
    updateRolePathParamDto: UpdateRolePathParamDto,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleDocument> {
    try {
      const options = {
        id: updateRolePathParamDto.id,
        tenantId: updateRolePathParamDto.tenantId,
        ...updateRoleDto,
      };

      return await this.unifiedOperationService.handleOperation(OperationType.UPDATE, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error updating record',
          message: error.message,
          resource: RolesService.name,
        }),
      );
      throw error;
    }
  }

  async deleteOneRole(deleteRoleDto: DeleteRoleDto): Promise<string> {
    try {
      const options = { id: deleteRoleDto.id, tenantId: deleteRoleDto.tenantId };
      await this.findAssociatedRole({ id: deleteRoleDto.id, tenantId: deleteRoleDto.tenantId });
      return await this.unifiedOperationService.handleOperation(OperationType.DELETE, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error deleting record',
          message: error.message,
          resource: RolesService.name,
        }),
      );
      throw error;
    }
  }
}
