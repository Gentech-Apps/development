import { Injectable, Logger } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import mongoose from 'mongoose';
import { MailsService } from '../../shared/modules/mails/mails.service';
import {
  startSessionWithTimeout,
  commitOrAbortSession,
} from '../../shared/utils/transaction-session';
import { EmailRequestDto } from '../../shared/modules/mails/dtos/mail.dto';
import { CreateTenantOperationDto } from './dtos/create-tenant-operation.dto';
import { getRolesScope } from './utils/get-roles-scopes';
import { InjectConnection } from '@nestjs/mongoose';
import { EmailTemplateTypeEnum } from '../../shared/enums/template.enum';
import { CreateUserOperationDto } from '../users/dtos/create-user-operation.dto';

@Injectable()
export class TenantsOperationService {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly mailService: MailsService,
    private readonly logger: Logger,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createOneTenantWithRolesAndUser(createTenantOperationDto: CreateTenantOperationDto) {
    // Start the transaction session and set the timeout
    const { transactionSession, timeout } = await startSessionWithTimeout(this.connection);
    transactionSession.startTransaction();

    try {
      // Log the Tenant creation
      this.logger.verbose(
        JSON.stringify({
          context: 'Tenant creation started',
          message: 'Transaction Started',
          resource: TenantsOperationService.name,
        }),
      );
      const tenant = await this.tenantsService.createOneTenant(
        createTenantOperationDto,
        transactionSession,
      );
      this.logger.verbose(
        JSON.stringify({
          context: 'Tenant creation finished',
          message: 'Transaction Continue to Role creation',
          resource: TenantsOperationService.name,
        }),
      );

      // Log the Role creation
      this.logger.verbose(
        JSON.stringify({
          context: 'Role creation started',
          message: 'Transaction Continued',
          resource: TenantsOperationService.name,
        }),
      );
      const createRoleDto = getRolesScope(tenant);
      const roles = await this.rolesService.createBatchRoles(createRoleDto, transactionSession);
      this.logger.verbose(
        JSON.stringify({
          context: 'Role creation finished',
          message: 'Transaction Continued to User creation',
          resource: TenantsOperationService.name,
        }),
      );

      // Log the User creation
      this.logger.verbose(
        JSON.stringify({
          context: 'User creation started',
          message: 'Transaction Continued',
          resource: TenantsOperationService.name,
        }),
      );
      const createUserDto: CreateUserOperationDto = {
        email: createTenantOperationDto.email,
        roleId: roles[0]._id,
        tenantId: tenant._id,
      };
      const user = await this.usersService.createOneUser(createUserDto, transactionSession);
      this.logger.verbose(
        JSON.stringify({
          context: 'User creation finished',
          message: 'Transaction Completed',
          resource: TenantsOperationService.name,
        }),
      );
      // Commit the transaction since everything was successful
      await commitOrAbortSession(transactionSession, timeout, true);

      // Log the email sending step
      try {
        this.logger.verbose(
          JSON.stringify({
            context: 'Email sending started',
            message: 'Prepared data to send an email',
            resource: TenantsOperationService.name,
          }),
        );
        const data: Partial<EmailRequestDto> = {
          to: user.email,
          subject: 'Welcome to Canteen Management System',
          emailTemplateType: EmailTemplateTypeEnum.REGISTER,
          content: {
            domainUrl: tenant.domainUrl,
            username: user.name,
            email: user.email,
            password: user.password,
          },
        };
        this.mailService.sendEmail(data);
        this.logger.verbose(
          JSON.stringify({
            context: 'Email sending finished',
            message: 'Email sent',
            resource: TenantsOperationService.name,
          }),
        );
      } catch (error) {
        this.logger.error(
          JSON.stringify({
            context: 'Email sending finished with error',
            message: error.message,
            resource: TenantsOperationService.name,
          }),
        );
      }

      // Return the domainUrl of the tenant
      return {
        domainUrl: tenant.domainUrl,
      };
    } catch (error) {
      // If an error occurs, abort the transaction
      this.logger.warn(
        JSON.stringify({
          context: 'Error creating tenant',
          message: error.message,
          resource: TenantsOperationService.name,
        }),
      );
      await commitOrAbortSession(transactionSession, timeout, false);
      throw error;
    }
  }
}
