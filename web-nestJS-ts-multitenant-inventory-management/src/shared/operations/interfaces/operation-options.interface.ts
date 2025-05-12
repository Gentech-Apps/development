import mongoose from 'mongoose';

export interface OperationOptions<T> {
  data?: Partial<T> | Partial<T>[];
  session?: mongoose.ClientSession;
  id?: string;
  tenantId?: string;
  query?: {
    cursor?: {
      $skip: number;
      $limit: number;
      version: number;
    };
    filter?: Record<string, unknown>;
    stages?: Record<string, unknown>[];
  };
}
