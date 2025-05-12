import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Query,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateSuggestionDto } from './dtos/create-suggestion.dto';
import { ApiBearerAuth, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Suggestion } from './schema/suggestion.schema';
import {
  ApiXCreateResponses,
  ApiXGetResponses,
  ApiXListResponses,
  ApiXUpdateResponses,
} from '../../shared/decorators/swagger/swagger';
import { SuggestionsService } from './suggestions.service';
import { UnifiedListQueryResponseDto } from '../../shared/dto/unified-list-query-response.dto';
import { ListSuggestionsQueryDto } from './dtos/list-suggestion.dto';
import { UpdateSuggestionDto } from './dtos/update-suggestion.dto';
import { toTitleCase } from '../../shared/utils/string-operations';
import { API_KEY, ApiControllerTag, ApiTypeTag } from '../../swagger/tags';
import { JwtAuthGuard } from '../../shared/guards/auth.guard';
import { RolesAndPermissionGuard } from '../../shared/guards/roles-and-permission.guard';
import { GlobalBodyPipe } from '../../shared/pipes/global-body-param.pipe';
import { GetOneSuggestionDto } from './dtos/get-suggestion.dto';
import { GlobalPathParamPipe } from '../../shared/pipes/global-path-param.pipe';
import { UpdateSuggestionPathParamDto } from './dtos/udpate-suggestion-path-param.dto';
import { GlobalQueryPipe } from '../../shared/pipes/global-query-param.pipe';

@ApiSecurity(API_KEY)
@ApiTags(toTitleCase(ApiControllerTag.Suggestions))
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAndPermissionGuard)
@Controller(ApiControllerTag.Suggestions)
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @ApiXCreateResponses({
    operationId: 'create_a_suggestion',
    summary: 'Create a suggestion',
    type: Suggestion,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalBodyPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOneSuggestion(@Body() createSuggestionDto: CreateSuggestionDto): Promise<Suggestion> {
    return this.suggestionsService.createOneSuggestion(createSuggestionDto);
  }

  @ApiXListResponses({
    operationId: 'list_suggestions',
    summary: 'List Suggestions',
    type: [Suggestion],
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalQueryPipe)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAllSuggestions(
    @Query() query: ListSuggestionsQueryDto,
  ): Promise<UnifiedListQueryResponseDto<Suggestion>> {
    return this.suggestionsService.findAllSuggestions(query);
  }

  @ApiParam({
    name: 'id',
    description: 'Suggestion ID',
    type: String,
  })
  @ApiXGetResponses({
    operationId: 'get_suggestion',
    summary: 'Get Suggestion',
    type: Suggestion,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOneSuggestion(
    @Param('id') getOneSuggestionDto: GetOneSuggestionDto,
  ): Promise<Suggestion> {
    return await this.suggestionsService.findOneSuggestion(getOneSuggestionDto);
  }

  @ApiParam({
    name: 'id',
    description: 'Suggestion ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'update_suggestion',
    summary: 'Update Suggestion',
    type: Suggestion,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateOneSuggestion(
    @Param('id') updateSuggestionPathParamDto: UpdateSuggestionPathParamDto,
    @Body() updateSuggestionDto: UpdateSuggestionDto,
  ): Promise<Suggestion> {
    return this.suggestionsService.updateOneSuggestion(
      updateSuggestionPathParamDto,
      updateSuggestionDto,
    );
  }
}
