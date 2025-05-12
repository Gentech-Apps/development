import { OperationOptions } from '../interfaces/operation-options.interface';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../constants/pagination.constant';

export function applyDefaultOptions<T>(options: OperationOptions<T> = {}): OperationOptions<T> {
  const defaultCursor = {
    $skip: DEFAULT_SKIP,
    $limit: DEFAULT_LIMIT,
    version: 1,
  };
  const { cursor, filter, stages } = options?.query;

  const result: OperationOptions<T> = {
    query: {
      cursor: cursor ?? defaultCursor,
      filter,
      stages,
    },
  };
  return result;
}
