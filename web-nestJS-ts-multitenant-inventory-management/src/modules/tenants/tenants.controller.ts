import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpCode,
  Param,
  Patch,
  Query,
  UseGuards,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { Tenant } from './schema/tenant.schema';
import { ApiBearerAuth, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  ApiXCreateResponses,
  ApiXListResponses,
  ApiXGetResponses,
  ApiXUpdateResponses,
} from '../../shared/decorators/swagger/swagger';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dtos/update-tenant.dto';
import { ListTenantsQueryDto } from './dtos/list-tenant.dto';
import { UnifiedListQueryResponseDto } from '../../shared/dto/unified-list-query-response.dto';
import { API_KEY, ApiControllerTag, ApiTypeTag } from '../../swagger/tags';
import { toTitleCase } from '../../shared/utils/string-operations';
import { JwtAuthGuard } from '../../shared/guards/auth.guard';
import { RolesAndPermissionGuard } from '../../shared/guards/roles-and-permission.guard';
import { GlobalPathParamPipe } from '../../shared/pipes/global-path-param.pipe';
import { DeleteTenantDto } from './dtos/delete-tenant.dto';
import { DeleteTenantResponseDto } from './dtos/delete-tenant.dto';
import { GetTenantDto, GetTenantResponseDto } from './dtos/get-tenant.dto';

@ApiSecurity(API_KEY)
@ApiBearerAuth()
@ApiTags(toTitleCase(ApiControllerTag.Tenants))
@Controller(ApiControllerTag.Tenants)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}
  // Only Master admin will create tenant
  @ApiXCreateResponses({
    operationId: 'create_a_tenant',
    summary: 'Create a tenant',
    type: Tenant,
    tag: ApiTypeTag.Data,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOneTenant(@Body() createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.tenantsService.createOneTenant(createTenantDto);
  }

  @ApiXListResponses({
    operationId: 'list_tenants',
    summary: 'List Tenants',
    type: [Tenant],
    tag: ApiTypeTag.Data,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAllTenants(
    @Query() query: ListTenantsQueryDto,
  ): Promise<UnifiedListQueryResponseDto<Tenant>> {
    return this.tenantsService.findAllTenants(query);
  }

  @ApiXGetResponses({
    operationId: 'does_tenant_exist',
    summary: 'Does Tenant Exist',
    type: GetTenantResponseDto,
    tag: ApiTypeTag.Data,
  })
  @HttpCode(HttpStatus.OK)
  @Get('/exists')
  async doesTenantExist(@Query() getTenantDto: GetTenantDto): Promise<GetTenantResponseDto> {
    return await this.tenantsService.findOneTenantByCompanyName(getTenantDto);
  }

  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: String,
  })
  @ApiXGetResponses({
    operationId: 'get_tenant',
    summary: 'Get Tenant',
    type: Tenant,
    tag: ApiTypeTag.Data,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesAndPermissionGuard)
  @Get(':id')
  async findOneTenant(@Param('id') id: string): Promise<Tenant> {
    return await this.tenantsService.findOneTenant(id);
  }

  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'update_tenant',
    summary: 'Update Tenant',
    type: Tenant,
    tag: ApiTypeTag.Data,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesAndPermissionGuard)
  @Patch(':id')
  async updateOneTenant(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<Tenant> {
    return this.tenantsService.updateOneTenant(id, updateTenantDto);
  }

  @ApiParam({
    name: 'id',
    description: 'Tenant ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'delete_tenant',
    summary: 'Delete Tenant',
    type: DeleteTenantResponseDto,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @UseGuards(JwtAuthGuard, RolesAndPermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteOneTenant(@Param('id') deleteTenantDto: DeleteTenantDto): Promise<string> {
    return this.tenantsService.deleteOneTenant(deleteTenantDto);
  }
}
