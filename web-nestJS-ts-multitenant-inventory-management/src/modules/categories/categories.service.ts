import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OperationType } from '../../shared/operations/enums/operation.enum';
import { UnifiedOperationService } from '../../shared/operations/unified-operation';
import { CategoryDocument, Category } from './schema/category.schema';
import { notMissing } from '../../shared/utils/typecheck';
import { ListCategoriesQueryDto } from './dtos/list-category.dto';
import { UnifiedListQueryResponseDto } from '../../shared/dto/unified-list-query-response.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { REQUEST } from '@nestjs/core';
import { AuditLogsService } from '../../shared/modules/audit-logs/audit-logs.service';
import { GetCategoryDto } from './dtos/get-category.dto';
import { UpdateCategoryPathParamDto } from './dtos/update-category-path-param.dto';

@Injectable()
export class CategoriesService {
  private readonly unifiedOperationService: UnifiedOperationService<CategoryDocument>;

  constructor(
    @InjectModel(Category.name) private readonly CategoryModel: Model<CategoryDocument>,
    private readonly auditLogsService: AuditLogsService,
    @Inject(REQUEST) private request: Request,
    private readonly logger: Logger,
  ) {
    this.unifiedOperationService = new UnifiedOperationService<CategoryDocument>(
      CategoryModel,
      request,
      auditLogsService,
    );
  }

  async createOneCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    try {
      const options = {
        data: {
          ...createCategoryDto,
          nameLocale: notMissing(createCategoryDto.nameLocale)
            ? createCategoryDto.nameLocale
            : createCategoryDto.name,
        },
      };

      const createdCategory = await this.unifiedOperationService.handleOperation(
        OperationType.CREATE,
        options,
      );

      return createdCategory;
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error creating record',
          message: error.message,
          resource: CategoriesService.name,
        }),
      );
      throw error;
    }
  }

  async findAllCategories(
    query: ListCategoriesQueryDto,
  ): Promise<UnifiedListQueryResponseDto<Category>> {
    try {
      return await this.unifiedOperationService.handleOperation(OperationType.LIST, {
        query,
      });
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error finding record',
          message: error.message,
          resource: CategoriesService.name,
        }),
      );
      throw error;
    }
  }

  async findOneCategory(getCategoryDto: GetCategoryDto): Promise<CategoryDocument> {
    try {
      const options = { id: getCategoryDto.id, tenantId: getCategoryDto.tenantId };
      return await this.unifiedOperationService.handleOperation(OperationType.GET, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error getting record',
          message: error.message,
          resource: CategoriesService.name,
        }),
      );
      throw error;
    }
  }

  async updateOneCategory(
    updateCategoryPathParamDto: UpdateCategoryPathParamDto,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument> {
    try {
      const options = {
        id: updateCategoryPathParamDto.id,
        tenatId: updateCategoryPathParamDto.tenantId,
        ...updateCategoryDto,
      };

      return await this.unifiedOperationService.handleOperation(OperationType.UPDATE, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error updating record',
          message: error.message,
          resource: CategoriesService.name,
        }),
      );
      throw error;
    }
  }
}
