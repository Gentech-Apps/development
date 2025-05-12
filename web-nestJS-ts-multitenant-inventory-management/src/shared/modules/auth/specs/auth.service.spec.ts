import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../../../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { vi } from 'vitest';
import { AuthExamples } from './examples/auth.example';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Tenant } from '../../../../modules/tenants/schema/tenant.schema';
import { TenantsOperationService } from '../../../../modules/tenants/tenants.operation.service';
import { TenantsService } from '../../../../modules/tenants/tenants.service';

describe('#Auth.AuthService', () => {
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let tenantsModel: Model<Tenant>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let tenantsService: TenantsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersService: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let tenantsOperationService: TenantsOperationService;

  const mockAuthService = {
    authorize: vi.fn(),
    refreshToken: vi.fn(),
  };
  const mockUsersService = {
    validateUser: vi.fn(),
    findOneUser: vi.fn(),
  };

  const mockJwtService = {
    sign: vi.fn(),
    verify: vi.fn(),
  };

  const mockTenantsService = {
    createOneTenant: vi.fn(),
  };
  const mockTenantsOperationService = {
    createOneTenantWithRolesAndUser: vi.fn(),
  };
  const mockConfigService = {
    getOrThrow: vi.fn().mockReturnValue('testSecret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(Tenant.name), useValue: mockTenantsService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: TenantsOperationService, useValue: mockTenantsOperationService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    tenantsOperationService = module.get<TenantsOperationService>(TenantsOperationService);
    tenantsModel = module.get(getModelToken(Tenant.name));
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('.authorize', () => {
    it('should successfully authorize a user with valid credentials', async () => {
      const authDto = AuthExamples.authorize.ok.body;
      const user = { id: 'userId', tenantId: 'tenantId' };
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';

      mockUsersService.validateUser.mockResolvedValueOnce(user);
      mockJwtService.sign.mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken);
      vi.spyOn(authService, 'authorize').mockResolvedValue({
        accessToken: 'access_token',
        expireTime: 1685408400000,
        refreshToken: 'refresh_token',
      });
      const result = await authService.authorize(authDto);

      expect(result).toEqual(AuthExamples.authorize.ok.expected.output);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const authDto = AuthExamples.authorize.badRequest.body;

      mockAuthService.authorize.mockRejectedValueOnce(new UnauthorizedException());

      await expect(authService.authorize(authDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('.refreshToken', () => {
    it('should return a new access token and refresh token if refresh token is valid', async () => {
      const expected = AuthExamples.refreshToken.ok.expected.output;
      vi.spyOn(authService, 'refreshToken').mockResolvedValue(expected);

      const result = await authService.refreshToken({ refreshToken: 'refresh_token' });
      expect(result).toEqual(AuthExamples.refreshToken.ok.expected.output);
    });
  });
});
