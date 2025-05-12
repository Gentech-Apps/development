import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ActivityLog, ActivityLogDocument } from './schema/activity-log.schema';
import { Model } from 'mongoose';
import { CreateActivityLogDto } from './dtos/create-activity-log.dto';
import { ListActivityLogsQueryDto } from './dtos/list-activity-log.dto';
import { GetActivityLogDto } from './dtos/get-activity-log.dto';
import { UnifiedListQueryResponseDto } from '../../dto/unified-list-query-response.dto';
import { applyDefaultOptions } from '../../operations/utils/apply-default-option';
import { notMissing } from '../../utils/typecheck';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectModel(ActivityLog.name) private readonly ActivityLogModel: Model<ActivityLogDocument>,
    private readonly logger: Logger,
  ) {}

  async createOneActivityLog(
    createActivityLogDto: CreateActivityLogDto,
  ): Promise<ActivityLogDocument> {
    try {
      const data = {
        ...createActivityLogDto,
        requestQuery: notMissing(createActivityLogDto.query)
          ? createActivityLogDto.query
          : undefined,
        requestParam: notMissing(createActivityLogDto.param)
          ? createActivityLogDto.param
          : undefined,
        requestBody: notMissing(createActivityLogDto.body) ? createActivityLogDto.body : undefined,
      };
      return await this.ActivityLogModel.create(data);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error creating record',
          message: error.message,
          resource: ActivityLogsService.name,
        }),
      );
      throw error;
    }
  }

  async findAllActivityLogs(
    query: ListActivityLogsQueryDto,
  ): Promise<UnifiedListQueryResponseDto<ActivityLog> | any> {
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
      return await this.ActivityLogModel.aggregate(pipeline);
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error finding record',
          message: error.message,
          resource: ActivityLogsService.name,
        }),
      );
      throw error;
    }
  }

  async findOneActivityLog(getActivityLogDto: GetActivityLogDto): Promise<ActivityLogDocument> {
    try {
      const result = await this.ActivityLogModel.find({
        _id: getActivityLogDto.id,
        tenantId: getActivityLogDto.tenantId,
      }).exec();
      if (result.length === 0) {
        throw new NotFoundException(`Record not found with id: ${getActivityLogDto.id}`);
      }
      return result[0];
    } catch (error) {
      this.logger.verbose(
        JSON.stringify({
          context: 'Error getting record',
          message: error.message,
          resource: ActivityLogsService.name,
        }),
      );
      throw error;
    }
  }
}
