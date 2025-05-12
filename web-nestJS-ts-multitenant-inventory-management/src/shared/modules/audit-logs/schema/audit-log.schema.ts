import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsMongoId, IsEnum, IsIP } from 'class-validator';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { UnifiedIdentifiableModel } from '../../../models/unified-identifiable.model';
import { ApiControllerTag } from '../../../../swagger/tags';
import { ActionEnum } from '../enum/action.enum';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: true })
export class AuditLog extends UnifiedIdentifiableModel {
  @ApiPropertyOptional({
    description: 'The ID of the tenant.',
    type: 'string',
    format: 'ObjectId',
  })
  @IsMongoId({ message: 'Tenant id should be valid' })
  @IsNotEmpty({ message: 'Tenant id is required' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant' })
  @IsOptional()
  tenantId?: string;

  @ApiPropertyOptional({
    description: 'The ID of the user who performed the action',
    type: 'string',
    format: 'ObjectId',
  })
  @IsMongoId({ message: 'User id should be valid' })
  @IsNotEmpty({ message: 'User id is required' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: 'The entity affected by the action',
    enum: ApiControllerTag,
    example: 'users',
  })
  @IsEnum(ApiControllerTag, {
    message: 'Entity must be from the enum',
  })
  @Prop({ required: false })
  @IsOptional()
  entity?: string;

  @ApiPropertyOptional({
    description: 'The Action performed',
    enum: ActionEnum,
    example: ActionEnum.CREATE,
  })
  @IsEnum(ActionEnum, { message: 'Method must be a valid HTTP method' })
  @Prop({
    type: String,
  })
  @IsOptional()
  action?: string;

  @ApiPropertyOptional({
    description: 'The ID of the document',
    type: 'string',
    format: 'ObjectId',
  })
  @IsMongoId({ message: 'document id should be valid' })
  @IsNotEmpty({ message: 'document id is required' })
  @Prop({ type: MongooseSchema.Types.ObjectId })
  @IsOptional()
  documentId?: string;

  @ApiPropertyOptional({
    description: 'modifications in document',
  })
  @IsOptional()
  @Prop({ required: false, type: MongooseSchema.Types.Mixed })
  modifiedData?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'message',
    example: 'User created a new order',
  })
  @Prop()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional({
    description: 'The HTTP status code returned',
    example: 200,
  })
  @Prop({ required: true })
  @IsOptional()
  statusCode?: number;

  @ApiPropertyOptional({
    description: 'The IP address from which the request was made',
    example: '192.168.1.1',
  })
  @IsIP(undefined, { message: 'IP address must be valid' })
  @Prop()
  @IsOptional()
  ipAddress?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
