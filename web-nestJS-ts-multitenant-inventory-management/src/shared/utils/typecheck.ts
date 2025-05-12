import mongoose from 'mongoose';
import { UnifiedListQueryResponseDto } from '../dto/unified-list-query-response.dto';

export type LogError = Error & {
  response?: { data?: unknown; message?: unknown };
  context?: Record<string, unknown>;
  url?: string;
};

export type TypeGuard<T> = (value: unknown) => value is T;

export type TypeOf = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function';

export interface ErrorWithMultipleConstraints {
  response: {
    errors: string[];
  };
  status: number;
  options: Record<string, unknown>;
}

export const notMissing = <T>(value: T | null | undefined): value is T =>
  value !== undefined && value !== null;

export const isMissing = <T>(value: T | null | undefined): value is null | undefined =>
  value === undefined || value === null;

export const isMissingOrEmpty = <T>(value: T | null | undefined): value is null | undefined =>
  value === undefined || value === null || value.toString().trim() === '';

export function isObject(object: unknown): object is Record<string, unknown> {
  return notMissing(object) && typeof object === 'object' && !Array.isArray(object);
}

export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && !Number.isNaN(value);

export const isErrorWithMultipleConstraints = (
  value: unknown,
): value is ErrorWithMultipleConstraints => {
  const isListErrors = (valueListItem: unknown): valueListItem is string[] => {
    return (
      Array.isArray(valueListItem) &&
      (isArrayOfType(valueListItem, 'string') || valueListItem.length === 0)
    );
  };

  return (
    typeof value === 'object' &&
    value !== null &&
    'response' in value &&
    typeof value.response === 'object' &&
    value.response !== null &&
    'errors' in value.response &&
    Array.isArray(value.response.errors) &&
    (isArrayOfType(value.response.errors, 'string') ||
      isArrayOfType(value.response.errors, isListErrors)) &&
    'status' in value &&
    typeof value.status === 'number' &&
    'options' in value &&
    typeof value.options === 'object'
  );
};

const isArrayOfType = <T>(errors: unknown[], type: TypeOf | TypeGuard<T>): boolean => {
  return errors.every((error: unknown) =>
    typeof type === 'string' ? typeof error === type : type(error),
  );
};

export function isUnifiedListQueryResponseDto<T>(
  data: any,
): data is UnifiedListQueryResponseDto<T> {
  return (
    data &&
    typeof data === 'object' &&
    'data' in data &&
    (Array.isArray(data.data) || data.data === undefined) &&
    'totalCount' in data &&
    (typeof data.totalCount === 'number' || data.totalCount === undefined) &&
    ('next' in data ? typeof data.next === 'string' || data.next === null : true) &&
    ('prev' in data ? typeof data.prev === 'string' || data.prev === null : true) &&
    ('cursor' in data ? typeof data.cursor === 'string' : true)
  );
}

export function isUnifiedListStructure(data: any): boolean {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    Array.isArray(data[0].data) &&
    Array.isArray(data[0].totalCount)
  );
}

//function not in use
export function stringToObjectId(input: string) {
  return new mongoose.Types.ObjectId(input);
}
//function not in use
export function objectIdToString(input: mongoose.Types.ObjectId) {
  return input.toString();
}
