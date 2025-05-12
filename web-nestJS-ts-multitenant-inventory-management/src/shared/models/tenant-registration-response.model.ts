import { ApiProperty } from '@nestjs/swagger';

export class TenantRegistrationResponseModel {
  @ApiProperty({
    description: 'Domain URL for the tenant',
    example: 'companyname.example.com',
  })
  domainUrl: string;
}
