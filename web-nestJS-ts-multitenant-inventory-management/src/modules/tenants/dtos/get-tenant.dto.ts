import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTenantDto {
  @ApiProperty({
    description: 'Company name',
    example: 'string',
    required: true,
  })
  @IsString()
  companyName: string;
}

export class GetTenantResponseDto {
  @ApiProperty({
    description: 'Tenant ID',
    type: String,
  })
  _id: string;

  @ApiProperty({
    description: 'Domain url of tenant',
    type: String,
  })
  domainUrl: string;
}
