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
  UsePipes,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  ApiXCreateResponses,
  ApiXGetResponses,
  ApiXListResponses,
  ApiXUpdateResponses,
} from '../../shared/decorators/swagger/swagger';
import { ApiBearerAuth, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UnifiedListQueryResponseDto } from '../../shared/dto/unified-list-query-response.dto';
import { User } from './schema/user.schema';
import { ListUsersQueryDto } from './dtos/list-user.dto';
import { toTitleCase } from '../../shared/utils/string-operations';
import { API_KEY, ApiControllerTag, ApiTypeTag } from '../../swagger/tags';
import { JwtAuthGuard } from '../../shared/guards/auth.guard';
import { RolesAndPermissionGuard } from '../../shared/guards/roles-and-permission.guard';
import { GlobalBodyPipe } from '../../shared/pipes/global-body-param.pipe';
import { GlobalPathParamPipe } from '../../shared/pipes/global-path-param.pipe';
import { GetUserDto } from './dtos/get-user.dto';
import { UpdateUserPathParamDto } from './dtos/update-user-path-param.dto';
import { GlobalQueryPipe } from '../../shared/pipes/global-query-param.pipe';
import { DeleteUserResponseDto } from './dtos/delete-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';

@ApiSecurity(API_KEY)
@ApiTags(toTitleCase(ApiControllerTag.Users))
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesAndPermissionGuard)
@Controller(ApiControllerTag.Users)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiXCreateResponses({
    operationId: 'create_a_user',
    summary: 'Create a user',
    type: User,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalBodyPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOneUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createOneUser(createUserDto);
  }

  @ApiXListResponses({
    operationId: 'list_users',
    summary: 'List Users',
    type: [User],
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalQueryPipe)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAllUsers(
    @Query() query: ListUsersQueryDto,
  ): Promise<UnifiedListQueryResponseDto<User>> {
    return this.usersService.findAllUsers(query);
  }

  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
  })
  @ApiXGetResponses({
    operationId: 'get_user',
    summary: 'Get User',
    type: User,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOneUser(@Param('id') getUserDto: GetUserDto): Promise<User> {
    return await this.usersService.findOneUser(getUserDto);
  }

  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'update_user',
    summary: 'Update User',
    type: User,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateOneUser(
    @Param('id') updateUserPathParamDto: UpdateUserPathParamDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateOneUser(updateUserPathParamDto, updateUserDto);
  }

  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: String,
  })
  @ApiXUpdateResponses({
    operationId: 'delete_user',
    summary: 'Delete User',
    type: DeleteUserResponseDto,
    tag: ApiTypeTag.Data,
  })
  @UsePipes(GlobalPathParamPipe)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteOneUser(@Param('id') deleteOneUser: DeleteUserDto): Promise<string> {
    return this.usersService.deleteOneUser(deleteOneUser);
  }
}
