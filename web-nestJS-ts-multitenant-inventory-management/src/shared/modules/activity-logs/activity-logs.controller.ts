import {
  UseGuards,
  Controller,
  UsePipes,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiSecurity, ApiTags, ApiBearerAuth, ApiExcludeEndpoint, ApiParam } from '@nestjs/swagger';
import { API_KEY, ApiControllerTag, ApiTypeTag } from '../../../swagger/tags';
import {
  ApiXCreateResponses,
  ApiXListResponses,
  ApiXGetResponses,
} from '../../decorators/swagger/swagger';
import { UnifiedListQueryResponseDto } from '../../dto/unified-list-query-response.dto';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { RolesAndPermissionGuard } from '../../guards/roles-and-permission.guard';
import { GlobalBodyPipe } from '../../pipes/global-body-param.pipe';
import { GlobalPathParamPipe } from '../../pipes/global-path-param.pipe';
import { GlobalQueryPipe } from '../../pipes/global-query-param.pipe';
import { toTitleCase } from '../../utils/string-operations';
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dtos/create-activity-log.dto';
import { GetActivityLogDto } from './dtos/get-activity-log.dto';
import { ListActivityLogsQueryDto } from './dtos/list-activity-log.dto';
import { ActivityLog } from './schema/activity-log.schema';

@ApiSecurity(API_KEY)
@ApiTags(toTitleCase(ApiControllerTag.ActivityLogs))
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAndPermissionGuard)
@Controller(ApiControllerTag.ActivityLogs)
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @ApiExcludeEndpoint()
  @ApiXCreateResponses({
    operationId: 'create_an_activity_log',
    summary: 'Create an activity log',
    type: ActivityLog,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalBodyPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOneActivitLog(
    @Body() createActivityLogDto: CreateActivityLogDto,
  ): Promise<ActivityLog> {
    return this.activityLogsService.createOneActivityLog(createActivityLogDto);
  }

  @ApiXListResponses({
    operationId: 'list_activity_logs',
    summary: 'List Activity Logs',
    type: [ActivityLog],
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalQueryPipe)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAllActivityLogs(
    @Query() query: ListActivityLogsQueryDto,
  ): Promise<UnifiedListQueryResponseDto<ActivityLog>> {
    return this.activityLogsService.findAllActivityLogs(query);
  }

  @ApiParam({
    name: 'id',
    description: 'Activity Log ID',
    type: String,
  })
  @ApiXGetResponses({
    operationId: 'get_activity_log',
    summary: 'Get Activity Logs',
    type: ActivityLog,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOneActivityLog(
    @Param('id') getActivityLogDto: GetActivityLogDto,
  ): Promise<ActivityLog> {
    return await this.activityLogsService.findOneActivityLog(getActivityLogDto);
  }
}
