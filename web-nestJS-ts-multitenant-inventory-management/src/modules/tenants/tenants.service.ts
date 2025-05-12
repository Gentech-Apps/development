import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Tenant, TenantDocument } from './schema/tenant.schema';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { ConfigService } from '@nestjs/config';
import { UnifiedOperationService } from '../../shared/operations/unified-operation';
import { OperationType } from '../../shared/operations/enums/operation.enum';
import { isMissing, isMissingOrEmpty } from '../../shared/utils/typecheck';
import { countryMap } from '../../shared/enums/country.enum';
import { languageMap } from '../../shared/enums/language.enum';
import { currencyMap } from '../../shared/enums/currency.enum';
import { UpdateTenantDto } from './dtos/update-tenant.dto';
import { ListTenantsQueryDto } from './dtos/list-tenant.dto';
import { UnifiedListQueryResponseDto } from '../../shared/dto/unified-list-query-response.dto';
import { REQUEST } from '@nestjs/core';
import { AuditLogsService } from '../../shared/modules/audit-logs/audit-logs.service';
import { DeleteTenantDto } from './dtos/delete-tenant.dto';
import { GetTenantDto, GetTenantResponseDto } from './dtos/get-tenant.dto';

@Injectable()
export class TenantsService {
  private readonly unifiedOperationService: UnifiedOperationService<TenantDocument>;

  constructor(
    @InjectModel(Tenant.name) private readonly tenantModel: Model<TenantDocument>,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
    private readonly auditLogsService: AuditLogsService,
    @Inject(REQUEST) private request: Request,
  ) {
    this.unifiedOperationService = new UnifiedOperationService<TenantDocument>(
      tenantModel,
      request,
      auditLogsService,
    );
  }

  async createOneTenant(
    createTenantDto: CreateTenantDto,
    session?: mongoose.ClientSession,
  ): Promise<TenantDocument> {
    try {
      const baseDomainUrl = this.configService.get<string>('domainUrl');

      if (isMissingOrEmpty(baseDomainUrl)) {
        this.logger.warn(
          JSON.stringify({
            context: 'Domain URL seems to be missing from environment configurations',
            resource: TenantsService.name,
          }),
        );
        throw new UnprocessableEntityException(`Unable to register the tenant`);
      }

      const options = {
        data: {
          ...createTenantDto,
          name: createTenantDto.companyName,
          domainUrl: `${createTenantDto.companyName}.${baseDomainUrl}`,
          countryDetails: countryMap[createTenantDto.country],
          secondaryLanguageDetails: languageMap[createTenantDto.secondaryLanguage],
          currencyDetails: currencyMap[createTenantDto.currency],
        },
        session,
      };

      return await this.unifiedOperationService.handleOperation(OperationType.CREATE, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error creating record',
          message: error.message,
          resource: TenantsService.name,
        }),
      );
      throw error;
    }
  }

  async findAllTenants(query: ListTenantsQueryDto): Promise<UnifiedListQueryResponseDto<Tenant>> {
    try {
      return await this.unifiedOperationService.handleOperation(OperationType.LIST, {
        query,
      });
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error finding record',
          message: error.message,
          resource: TenantsService.name,
        }),
      );
      throw error;
    }
  }

  async findOneTenant(id: string): Promise<TenantDocument> {
    try {
      const options = { id };
      return await this.unifiedOperationService.handleOperation(OperationType.GET, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error getting record',
          message: error.message,
          resource: TenantsService.name,
        }),
      );
      throw error;
    }
  }

  async updateOneTenant(id: string, updateTenantDto: UpdateTenantDto): Promise<TenantDocument> {
    try {
      const options = {
        id,
        ...updateTenantDto,
        countryDetails: countryMap[updateTenantDto.country],
        secondaryLanguageDetails: languageMap[updateTenantDto.secondaryLanguage],
        currencyDetails: currencyMap[updateTenantDto.currency],
      };

      return await this.unifiedOperationService.handleOperation(OperationType.UPDATE, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error updating record',
          message: error.message,
          resource: TenantsService.name,
        }),
      );
      throw error;
    }
  }

  async deleteOneTenant(deleteTenantDto: DeleteTenantDto): Promise<string> {
    try {
      const options = { id: deleteTenantDto.id, tenantId: deleteTenantDto.tenantId };
      return await this.unifiedOperationService.handleOperation(OperationType.DELETE, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error deleting record',
          message: error.message,
          resource: TenantsService.name,
        }),
      );
      throw error;
    }
  }

  async findOneTenantByCompanyName(getTenantDto: GetTenantDto): Promise<GetTenantResponseDto> {
    const result = await this.unifiedOperationService.handleOperation(OperationType.LIST, {
      query: {
        stages: [
          { $match: { companyName: getTenantDto.companyName } },
          { $project: { _id: 1, domainUrl: 1 } },
        ],
      },
    });

    const tenant = result.data[0];

    if (isMissing(tenant) || tenant.isDeleted) {
      throw new NotFoundException(`Tenant doesn't exist`);
    }
    if (!tenant.isActive) {
      throw new NotFoundException('Tenant is inactive');
    }

    return tenant;
  }
}
