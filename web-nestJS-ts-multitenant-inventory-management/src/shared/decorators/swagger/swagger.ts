import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiXConfig } from '../../../swagger/tags';
import { GlobalExceptionResponseApiModel } from '../../models/global-response-api.model';

// INFO: Responses for Create operations
export function ApiXCreateResponses({
  type,
  tag,
  operationId,
  summary,
  deprecated = false,
}: ApiXConfig) {
  const namespacedOperationId = `${tag}_${operationId}`;
  const decorators = [
    ApiOperation({
      operationId: namespacedOperationId,
      summary,
      deprecated,
    }),
    ApiCreatedResponse({
      type,
      description: 'Record created successfully.',
    }),
    ApiBadRequestResponse({ description: 'Bad Request', type: GlobalExceptionResponseApiModel }),
    ApiForbiddenResponse({ description: 'Forbidden', type: GlobalExceptionResponseApiModel }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: GlobalExceptionResponseApiModel }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: GlobalExceptionResponseApiModel,
    }),
  ];

  return applyDecorators(...decorators);
}

// INFO: Responses for List operation
export function ApiXListResponses({
  type,
  tag,
  operationId,
  summary,
  deprecated = false,
}: ApiXConfig) {
  const namespacedOperationId = `${tag}_${operationId}`;
  const decorators = [
    ApiOperation({
      operationId: namespacedOperationId,
      summary,
      deprecated,
    }),
    ApiOkResponse({
      type,
      description: 'Return list of records',
    }),
    ApiBadRequestResponse({ description: 'Bad Request', type: GlobalExceptionResponseApiModel }),
    ApiForbiddenResponse({ description: 'Forbidden', type: GlobalExceptionResponseApiModel }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: GlobalExceptionResponseApiModel }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: GlobalExceptionResponseApiModel,
    }),
  ];

  return applyDecorators(...decorators);
}

// INFO: Responses for Get operation
export function ApiXGetResponses({
  type,
  tag,
  operationId,
  summary,
  deprecated = false,
}: ApiXConfig) {
  const namespacedOperationId = `${tag}_${operationId}`;
  const decorators = [
    ApiOperation({
      operationId: namespacedOperationId,
      summary,
      deprecated,
    }),
    ApiOkResponse({
      type,
      description: 'Return record by the given identifier',
    }),
    ApiNotFoundResponse({ description: 'Not Found', type: GlobalExceptionResponseApiModel }),
    ApiBadRequestResponse({ description: 'Bad Request', type: GlobalExceptionResponseApiModel }),
    ApiForbiddenResponse({ description: 'Forbidden', type: GlobalExceptionResponseApiModel }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: GlobalExceptionResponseApiModel }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: GlobalExceptionResponseApiModel,
    }),
  ];

  return applyDecorators(...decorators);
}

// INFO: Responses for Update operation
export function ApiXUpdateResponses({
  type,
  tag,
  operationId,
  summary,
  deprecated = false,
}: ApiXConfig) {
  const namespacedOperationId = `${tag}_${operationId}`;
  const decorators = [
    ApiOperation({
      operationId: namespacedOperationId,
      summary,
      deprecated,
    }),
    ApiOkResponse({
      type,
      description: 'Record updated successfully.',
    }),
    ApiNotFoundResponse({ description: 'Not Found', type: GlobalExceptionResponseApiModel }),
    ApiBadRequestResponse({ description: 'Bad Request', type: GlobalExceptionResponseApiModel }),
    ApiForbiddenResponse({ description: 'Forbidden', type: GlobalExceptionResponseApiModel }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: GlobalExceptionResponseApiModel }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: GlobalExceptionResponseApiModel,
    }),
  ];

  return applyDecorators(...decorators);
}

// INFO: Responses for Delete operation
export function ApiXDeleteResponses({
  type,
  tag,
  operationId,
  summary,
  deprecated = false,
}: ApiXConfig) {
  const namespacedOperationId = `${tag}_${operationId}`;
  const decorators = [
    ApiOperation({
      operationId: namespacedOperationId,
      summary,
      deprecated,
    }),
    ApiOkResponse({
      type,
      description: 'Record deleted successfully.',
    }),
    ApiNotFoundResponse({ description: 'Not Found', type: GlobalExceptionResponseApiModel }),
    ApiBadRequestResponse({ description: 'Bad Request', type: GlobalExceptionResponseApiModel }),
    ApiForbiddenResponse({ description: 'Forbidden', type: GlobalExceptionResponseApiModel }),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: GlobalExceptionResponseApiModel }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: GlobalExceptionResponseApiModel,
    }),
  ];

  return applyDecorators(...decorators);
}
