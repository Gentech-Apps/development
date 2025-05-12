import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Param,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  ApiXCreateResponses,
  ApiXGetResponses,
  ApiXListResponses,
  ApiXUpdateResponses,
} from '../../shared/decorators/swagger/swagger';
import { CategoriesService } from './categories.service';
import { Category } from './schema/category.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { ListCategoriesQueryDto } from './dtos/list-category.dto';
import { UnifiedListQueryResponseDto } from '../../shared/dto/unified-list-query-response.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { toTitleCase } from '../../shared/utils/string-operations';
import { API_KEY, ApiControllerTag, ApiTypeTag } from '../../swagger/tags';
import { JwtAuthGuard } from '../../shared/guards/auth.guard';
import { RolesAndPermissionGuard } from '../../shared/guards/roles-and-permission.guard';
import { GlobalBodyPipe } from '../../shared/pipes/global-body-param.pipe';
import { GlobalPathParamPipe } from '../../shared/pipes/global-path-param.pipe';
import { GetCategoryDto } from './dtos/get-category.dto';
import { UpdateCategoryPathParamDto } from './dtos/update-category-path-param.dto';
import { GlobalQueryPipe } from '../../shared/pipes/global-query-param.pipe';

@ApiSecurity(API_KEY)
@ApiTags(toTitleCase(ApiControllerTag.Categories))
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAndPermissionGuard)
@Controller(ApiControllerTag.Categories)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiXCreateResponses({
    operationId: 'create_a_category',
    summary: 'Create a category',
    type: Category,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalBodyPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOneCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.createOneCategory(createCategoryDto);
  }

  @ApiXListResponses({
    operationId: 'list_categories',
    summary: 'List Categories',
    type: [Category],
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalQueryPipe)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAllCategories(
    @Query() query: ListCategoriesQueryDto,
  ): Promise<UnifiedListQueryResponseDto<Category>> {
    return this.categoriesService.findAllCategories(query);
  }

  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: String,
  })
  @ApiXGetResponses({
    operationId: 'get_category',
    summary: 'Get Category',
    type: Category,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOneCategory(@Param('id') getCategoryDto: GetCategoryDto): Promise<Category> {
    return await this.categoriesService.findOneCategory(getCategoryDto);
  }

  @ApiParam({
    name: 'id',
    description: 'Category ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'update_category',
    summary: 'Update Category',
    type: Category,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateOneCategory(
    @Param('id') updateCategoryPathParamDto: UpdateCategoryPathParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.updateOneCategory(updateCategoryPathParamDto, updateCategoryDto);
  }
}
