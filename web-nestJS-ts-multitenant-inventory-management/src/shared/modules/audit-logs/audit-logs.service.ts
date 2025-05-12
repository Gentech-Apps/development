import { Injectable, Logger } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schema/audit-log.schema';
import { ListUsersQueryDto } from '../../../modules/users/dtos/list-user.dto';
import { UnifiedListQueryResponseDto } from '../../dto/unified-list-query-response.dto';
import { applyDefaultOptions } from '../../operations/utils/apply-default-option';

@Injectable()
export class AuditLogsService {
  constructor(
    private readonly logger: Logger,
    @InjectModel(AuditLog.name) private readonly AuditLogModel: Model<AuditLogDocument>,
  ) {}

  async createOneAuditLog(createAuditLogDto: CreateAuditLogDto): Promise<AuditLogDocument> {
    try {
      return await this.AuditLogModel.create(createAuditLogDto);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error creating record',
          message: error.message,
          resource: AuditLogsService.name,
        }),
      );
      throw error;
    }
  }

  async findAllAuditLogs(
    query: ListUsersQueryDto,
  ): Promise<UnifiedListQueryResponseDto<AuditLog> | any> {
    try {
      const updatedOptions = applyDefaultOptions({ query });
      const { $skip, $limit } = updatedOptions.query.cursor;

      const dataStages = [{ $skip: $limit * ($skip - 1) }, { $limit }];

      const pipeline: any = [
        ...(updatedOptions.query.stages ? updatedOptions.query.stages : []),
        {
          $facet: {
            data: dataStages,
            totalCount: [{ $count: 'totalCount' }],
          },
        },
      ];
      return await this.AuditLogModel.aggregate(pipeline);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error finding record',
          message: error.message,
          resource: AuditLogsService.name,
        }),
      );
      throw error;
    }
  }
}
