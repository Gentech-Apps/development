import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsIP,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UnifiedIdentifiableModel } from '../../../models/unified-identifiable.model';
import { ApiControllerTag } from '../../../../swagger/tags';
import { HttpMethods } from '../../../enums/http-methods.enum';

export type ActivityLogDocument = HydratedDocument<ActivityLog>;

@Schema({ timestamps: true })
export class ActivityLog extends UnifiedIdentifiableModel {
  @ApiPropertyOptional({
    description: 'The ID of the tenant associated with the activity log',
    type: 'string',
    format: 'ObjectId',
  })
  @IsMongoId({ message: 'Tenant id should be valid' })
  @IsNotEmpty({ message: 'Tenant id is required' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: false })
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
    description: 'The HTTP method of the request (e.g., GET, POST)',
    enum: HttpMethods,
    example: 'POST',
  })
  @IsEnum(HttpMethods, { message: 'Method must be a valid HTTP method' })
  @Prop({
    type: String,
    required: true,
  })
  @IsOptional()
  method?: string;

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
    description: 'The HTTP status code returned',
    example: 200,
  })
  @Prop({ required: true })
  @IsOptional()
  statusCode?: number;

  @ApiPropertyOptional({
    description: 'The request body associated with the method',
    type: 'object',
    additionalProperties: true,
  })
  @Prop({ type: MongooseSchema.Types.Mixed })
  @IsOptional()
  body?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'The request headers',
    type: 'object',
    additionalProperties: true,
  })
  @IsNotEmpty({ message: 'Header is required' })
  @Prop({ type: MongooseSchema.Types.Mixed })
  @IsOptional()
  headers?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'The query parameters of the request',
    type: 'object',
    additionalProperties: true,
  })
  @Prop({ type: MongooseSchema.Types.Mixed })
  @IsOptional()
  query?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'The path parameters of the request',
    type: 'object',
    additionalProperties: true,
  })
  @Prop({ type: MongooseSchema.Types.Mixed })
  @IsOptional()
  param?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'The API endpoint path',
    example: '/api/v1/users',
  })
  @IsString({ message: 'Path must be a string' })
  @Prop()
  @IsOptional()
  path?: string;

  @ApiPropertyOptional({
    description: 'The IP address from which the request was made',
    example: '192.168.1.1',
  })
  @IsIP(undefined, { message: 'IP address must be valid' })
  @Prop()
  @IsOptional()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'message',
    example: 'User created a new order',
  })
  @IsArray({ message: 'Message must be an array' })
  @Prop()
  @IsOptional()
  message?: string[];
}
export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);
