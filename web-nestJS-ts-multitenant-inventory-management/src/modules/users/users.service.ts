/*eslint-disable @typescript-eslint/no-unused-vars*/
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UnifiedListQueryResponseDto } from '../../shared/dto/unified-list-query-response.dto';
import { OperationType } from '../../shared/operations/enums/operation.enum';
import { UnifiedOperationService } from '../../shared/operations/unified-operation';
import { UserDocument, User } from './schema/user.schema';
import { isMissing, notMissing } from '../../shared/utils/typecheck';
import { ListUsersQueryDto } from './dtos/list-user.dto';
import { isCreateUserDto } from './utils';
import { generateStrongPassword } from '../../shared/utils/generate-strong-password';
import { CreateUserOperationDto } from './dtos/create-user-operation.dto';
import { REQUEST } from '@nestjs/core';
import { AuditLogsService } from '../../shared/modules/audit-logs/audit-logs.service';
import { GetUserDto } from './dtos/get-user.dto';
import { UpdateUserPathParamDto } from './dtos/update-user-path-param.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { ValidateUser } from './interfaces/validate-user.interface';

@Injectable()
export class UsersService {
  private readonly unifiedOperationService: UnifiedOperationService<UserDocument>;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly auditLogsService: AuditLogsService,
    @Inject(REQUEST) private request: Request,
    private readonly logger: Logger,
  ) {
    this.unifiedOperationService = new UnifiedOperationService<UserDocument>(
      userModel,
      request,
      auditLogsService,
    );
  }

  async createOneUser(
    createUserDto: CreateUserDto | CreateUserOperationDto,
    session?: mongoose.ClientSession,
  ): Promise<UserDocument> {
    try {
      const options = {
        data: {
          ...createUserDto,
          password: generateStrongPassword(),
          nameLocale:
            isCreateUserDto(createUserDto) && notMissing(createUserDto.nameLocale)
              ? createUserDto.nameLocale
              : (createUserDto as CreateUserDto).name,
          profileImage:
            isCreateUserDto(createUserDto) && notMissing(createUserDto.profileImage)
              ? createUserDto.profileImage
              : undefined,
        },
        session,
      };

      await this.unifiedOperationService.recordAlreadyExists({
        tenantId: createUserDto.tenantId,
        email: createUserDto.email,
      });

      const createdUser = await this.unifiedOperationService.handleOperation(
        OperationType.CREATE,
        options,
      );

      return createdUser;
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error creating record',
          message: error.message,
          resource: UsersService.name,
        }),
      );
      throw error;
    }
  }

  async findAllUsers(query: ListUsersQueryDto): Promise<UnifiedListQueryResponseDto<User>> {
    try {
      return await this.unifiedOperationService.handleOperation(OperationType.LIST, {
        query,
      });
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error finding record',
          message: error.message,
          resource: UsersService.name,
        }),
      );
      throw error;
    }
  }

  async findOneUser(getUserDto: GetUserDto): Promise<UserDocument> {
    try {
      const options = { id: getUserDto.id, tenantId: getUserDto.tenantId };
      return await this.unifiedOperationService.handleOperation(OperationType.GET, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error getting record',
          message: error.message,
          resource: UsersService.name,
        }),
      );
      throw error;
    }
  }

  async updateOneUser(
    updateUserPathParamDto: UpdateUserPathParamDto,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      const options = {
        id: updateUserPathParamDto.id,
        tenantId: updateUserPathParamDto.tenantId,
        ...updateUserDto,
      };
      return await this.unifiedOperationService.handleOperation(OperationType.UPDATE, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error updating record',
          message: error.message,
          resource: UsersService.name,
        }),
      );
      throw error;
    }
  }

  async deleteOneUser(deleteUserDto: DeleteUserDto): Promise<string> {
    try {
      const options = { id: deleteUserDto.id, tenantId: deleteUserDto.tenantId };
      return await this.unifiedOperationService.handleOperation(OperationType.DELETE, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error deleting record',
          message: error.message,
          resource: UsersService.name,
        }),
      );
      throw error;
    }
  }

  async validateUser(validateUser: ValidateUser): Promise<UserDocument> {
    const { email, password, tenantId } = validateUser;
    const query = {
      stages: [{ $match: { email, tenantId } }],
    };
    const record = await this.unifiedOperationService.handleOperation(OperationType.LIST, {
      query,
    });

    const user = record.data[0];

    if (isMissing(user) || user.isDeleted) {
      throw new UnauthorizedException('Email is invalid.');
    }

    if (!user.isActive) {
      throw new BadRequestException('User is inactive');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Password is invalid.');
    }

    return user;
  }
}
