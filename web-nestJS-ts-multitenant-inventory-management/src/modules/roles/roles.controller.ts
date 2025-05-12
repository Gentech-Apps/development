import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Delete,
  UsePipes,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { ApiBearerAuth, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnifiedListQueryResponseDto } from '../../shared/dto/unified-list-query-response.dto';
import { Role } from './schema/role.schema';
import { ListRolesQueryDto } from './dtos/list-role.dto';
import {
  ApiXCreateResponses,
  ApiXListResponses,
  ApiXGetResponses,
  ApiXUpdateResponses,
} from '../../shared/decorators/swagger/swagger';
import { toTitleCase } from '../../shared/utils/string-operations';
import { API_KEY, ApiControllerTag, ApiTypeTag } from '../../swagger/tags';
import { JwtAuthGuard } from '../../shared/guards/auth.guard';
import { RolesAndPermissionGuard } from '../../shared/guards/roles-and-permission.guard';
import { AssociatedRoleDto } from './dtos/associated-role.dto';
import { GlobalPathParamPipe } from '../../shared/pipes/global-path-param.pipe';
import { DeleteRoleDto } from './dtos/delete-role.dto';
import { GetRoleDto } from './dtos/get-role.dto';
import { GlobalBodyPipe } from '../../shared/pipes/global-body-param.pipe';
import { UpdateRolePathParamDto } from './dtos/update-role-path-param.dto';
import { GlobalQueryPipe } from '../../shared/pipes/global-query-param.pipe';
import { DeleteRoleResponseDto } from './dtos/delete-role.dto';

@ApiSecurity(API_KEY)
@ApiTags(toTitleCase(ApiControllerTag.Roles))
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAndPermissionGuard)
@Controller(ApiControllerTag.Roles)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiXCreateResponses({
    operationId: 'create_a_role',
    summary: 'Create a role',
    type: Role,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalBodyPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOneRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.createOneRole(createRoleDto);
  }

  @ApiXListResponses({
    operationId: 'list_roles',
    summary: 'List Roles',
    type: [Role],
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalQueryPipe)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAllRoles(
    @Query() query: ListRolesQueryDto,
  ): Promise<UnifiedListQueryResponseDto<Role>> {
    return this.rolesService.findAllRoles(query);
  }

  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: String,
  })
  @ApiXGetResponses({
    operationId: 'get_role',
    summary: 'Get Role',
    type: Role,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOneRole(@Param('id') getRoleDto: GetRoleDto): Promise<Role> {
    return await this.rolesService.findOneRole(getRoleDto);
  }

  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: String,
  })
  @ApiXGetResponses({
    operationId: 'get_associated_role',
    summary: 'Get Associated Role',
    type: String,
    tag: ApiTypeTag.Operation,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Get('/associated/:id')
  async findAssociatedRole(@Param('id') associatedRoleDto: AssociatedRoleDto): Promise<string> {
    return await this.rolesService.findAssociatedRole(associatedRoleDto);
  }

  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'update_partial_role',
    summary: 'Update Partial Role',
    type: Role,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateOnePartialRole(
    @Param('id') updateRolePathParamDto: UpdateRolePathParamDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.updateOnePartialRole(updateRolePathParamDto, updateRoleDto);
  }

  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'update_role',
    summary: 'Update Role',
    type: Role,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async updateOneRole(
    @Param('id') updateRolePathParamDto: UpdateRolePathParamDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.updateOneRole(updateRolePathParamDto, updateRoleDto);
  }

  @ApiParam({
    name: 'id',
    description: 'Role ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'delete_role',
    summary: 'Delete Role',
    type: DeleteRoleResponseDto,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteOneRole(@Param('id') deleteRoleDto: DeleteRoleDto): Promise<string> {
    return this.rolesService.deleteOneRole(deleteRoleDto);
  }
}
