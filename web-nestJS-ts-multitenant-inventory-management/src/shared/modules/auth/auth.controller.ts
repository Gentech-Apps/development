import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthorizeDto } from './dtos/authorize.dto';
import { API_KEY, ApiControllerTag, ApiTypeTag } from '../../../swagger/tags';
import { toTitleCase } from '../../utils/string-operations';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dtos/refreshToken.dto';
import { ApiXCreateResponses } from '../../decorators/swagger/swagger';
import { AuthModel } from './models/auth.model';
import { RegisterTenantModel } from './models/register.model';
import { RegisterTenantDto } from './dtos/register.dto';

@ApiTags(toTitleCase(ApiControllerTag.Auth))
@Controller(ApiControllerTag.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiXCreateResponses({
    operationId: 'login_user',
    summary: 'Login User',
    type: AuthModel,
    tag: ApiTypeTag.Data,
  })
  @HttpCode(HttpStatus.OK)
  @Post('authorize')
  async authorize(@Body() authorizeDto: AuthorizeDto): Promise<AuthModel> {
    return await this.authService.authorize(authorizeDto);
  }

  @ApiXCreateResponses({
    operationId: 'generate_new_token',
    summary: 'Generate new token',
    type: AuthModel,
    tag: ApiTypeTag.Data,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiSecurity(API_KEY)
  @Post('token')
  async refreshToken(@Body() refreshToken: RefreshTokenDto): Promise<AuthModel> {
    return await this.authService.refreshToken(refreshToken);
  }

  @ApiXCreateResponses({
    operationId: 'register_tenant',
    summary: 'Register tenant',
    type: RegisterTenantModel,
    tag: ApiTypeTag.Operation,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerTenantDto: RegisterTenantDto): Promise<RegisterTenantModel> {
    return await this.authService.register(registerTenantDto);
  }
}
