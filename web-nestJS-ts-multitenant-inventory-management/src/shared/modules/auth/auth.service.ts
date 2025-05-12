import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../../modules/users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import {
  ACCESS_TOKEN_EXPIRATION_DURATION,
  EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_DURATION,
} from './utils/constants';
import { AuthorizeDto } from './dtos/authorize.dto';
import { RefreshTokenDto } from './dtos/refreshToken.dto';
import { UserDocument } from '../../../modules/users/schema/user.schema';
import { RegisterTenantDto } from './dtos/register.dto';
import { RegisterTenantModel } from './models/register.model';
import { TenantsOperationService } from '../../../modules/tenants/tenants.operation.service';
import { TenantsService } from '../../../modules/tenants/tenants.service';
import { objectIdToString } from '../../utils/typecheck';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly tenantsService: TenantsService,
    private readonly tenantsOperationService: TenantsOperationService,
  ) {}

  private generateToken(payload: JwtPayload, secret: string, expiresIn: string) {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  private createPayload(user: UserDocument) {
    return { tenant_id: user.tenantId, user_id: objectIdToString(user._id) };
  }

  private async createTokens(user: UserDocument) {
    const payload = this.createPayload(user);
    const accessToken = this.generateToken(
      payload,
      this.configService.getOrThrow('jwt.secret_key'),
      ACCESS_TOKEN_EXPIRATION_DURATION,
    );
    const refreshToken = this.generateToken(
      payload,
      this.configService.getOrThrow('jwt.refresh_secret_key'),
      REFRESH_TOKEN_EXPIRATION_DURATION,
    );
    return { accessToken, refreshToken };
  }

  async authorize(authorizeDto: AuthorizeDto) {
    const tenant = await this.tenantsService.findOneTenantByCompanyName({
      companyName: authorizeDto.companyName,
    });

    const options = {
      email: authorizeDto.email,
      password: authorizeDto.password,
      tenantId: tenant._id,
    };
    const user = await this.usersService.validateUser(options);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.createTokens(user);

    return { accessToken, refreshToken, expireTime: EXPIRATION_TIME };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
        secret: this.configService.getOrThrow('jwt.refresh_secret_key'),
      });

      const user = await this.usersService.findOneUser(payload.user_id);
      const { accessToken, refreshToken: newRefreshToken } = await this.createTokens(user);

      return { accessToken, refreshToken: newRefreshToken, expireTime: EXPIRATION_TIME };
    } catch (error) {
      throw error;
    }
  }

  async register(registerTenantDto: RegisterTenantDto): Promise<RegisterTenantModel> {
    return await this.tenantsOperationService.createOneTenantWithRolesAndUser(registerTenantDto);
  }
}
