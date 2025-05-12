import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSuggestionDto } from './dtos/create-suggestion.dto';
import { OperationType } from '../../shared/operations/enums/operation.enum';
import { UnifiedOperationService } from '../../shared/operations/unified-operation';
import { Suggestion, SuggestionDocument } from './schema/suggestion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListSuggestionsQueryDto } from './dtos/list-suggestion.dto';
import { UpdateSuggestionDto } from './dtos/update-suggestion.dto';
import { UnifiedListQueryResponseDto } from '../../shared/dto/unified-list-query-response.dto';
import { REQUEST } from '@nestjs/core';
import { AuditLogsService } from '../../shared/modules/audit-logs/audit-logs.service';
import { GetOneSuggestionDto } from './dtos/get-suggestion.dto';
import { UpdateSuggestionPathParamDto } from './dtos/udpate-suggestion-path-param.dto';

@Injectable()
export class SuggestionsService {
  private readonly unifiedOperationService: UnifiedOperationService<SuggestionDocument>;

  constructor(
    @InjectModel(Suggestion.name) private readonly suggestionModel: Model<SuggestionDocument>,
    private readonly auditLogsService: AuditLogsService,
    @Inject(REQUEST) private request: Request,
    private readonly logger: Logger,
  ) {
    this.unifiedOperationService = new UnifiedOperationService<SuggestionDocument>(
      suggestionModel,
      request,
      auditLogsService,
    );
  }

  async createOneSuggestion(createSuggestionDto: CreateSuggestionDto): Promise<SuggestionDocument> {
    try {
      const options = {
        data: {
          ...createSuggestionDto,
        },
      };

      const createdSuggestion = await this.unifiedOperationService.handleOperation(
        OperationType.CREATE,
        options,
      );

      return createdSuggestion;
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error creating record',
          message: error.message,
          resource: SuggestionsService.name,
        }),
      );
      throw error;
    }
  }

  async findAllSuggestions(
    query: ListSuggestionsQueryDto,
  ): Promise<UnifiedListQueryResponseDto<Suggestion>> {
    try {
      return await this.unifiedOperationService.handleOperation(OperationType.LIST, {
        query,
      });
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error finding record',
          message: error.message,
          resource: SuggestionsService.name,
        }),
      );
      throw error;
    }
  }

  async findOneSuggestion(getOneSuggestionDto: GetOneSuggestionDto): Promise<SuggestionDocument> {
    try {
      const options = { id: getOneSuggestionDto.id, tenantId: getOneSuggestionDto.tenantId };
      return await this.unifiedOperationService.handleOperation(OperationType.GET, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error getting record',
          message: error.message,
          resource: SuggestionsService.name,
        }),
      );
      throw error;
    }
  }

  async updateOneSuggestion(
    updateSuggestionPathParamDto: UpdateSuggestionPathParamDto,
    updateSuggestionDto: UpdateSuggestionDto,
  ): Promise<SuggestionDocument> {
    try {
      const options = {
        id: updateSuggestionPathParamDto.id,
        tenantId: updateSuggestionPathParamDto.tenantId,
        ...updateSuggestionDto,
      };

      return await this.unifiedOperationService.handleOperation(OperationType.UPDATE, options);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error updating record',
          message: error.message,
          resource: SuggestionsService.name,
        }),
      );
      throw error;
    }
  }
}
