export const API_KEY = 'API_KEY';

export enum ApiTypeTag {
  Data = 'data',
  Operation = 'ops',
}

export enum ApiControllerTag {
  Tenants = 'tenants',
  Roles = 'roles',
  ApiKeys = 'api_keys',
  Users = 'users',
  Categories = 'categories',
  Suggestions = 'suggestions',
  Items = 'items',
  Feedbacks = 'feedbacks',
  ActivityLogs = 'activity_logs',
  Auth = 'auth',
  AuditLogs = 'audit_logs',
}

export type ApiXConfig = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  type: any;
  tag: string;
  operationId: string;
  summary: string;
  deprecated?: boolean;
};
