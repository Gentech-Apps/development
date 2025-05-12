import { CursorDto } from '../../dto/unified-pagination.dto';
import { UnifiedResponseInterceptor } from '../unified-response.interceptor';
import { UnifiedResponseTransformExamples } from './examples/unified-response-transform.example';
import { DEFAULT_LIMIT, DEFAULT_SKIP } from '../../constants/pagination.constant';
import { ActivityLogsService } from '../../modules/activity-logs/activity-logs.service';

describe('#Interceptors.UnifiedResponseInterceptor', () => {
  let interceptor: UnifiedResponseInterceptor;

  beforeEach(() => {
    const activityLogsService = new ActivityLogsService(null, null);
    interceptor = new UnifiedResponseInterceptor(activityLogsService);
  });

  describe('.transformResponse', () => {
    it('should transform response with total count correctly', () => {
      const input = UnifiedResponseTransformExamples.withTotalCount.input;
      const cursor: CursorDto = { version: 1, $skip: DEFAULT_SKIP, $limit: DEFAULT_LIMIT };
      const expected = UnifiedResponseTransformExamples.withTotalCount.expected;

      const result = interceptor.transformResponse(input, cursor);

      expect(result).toEqual(expected);
    });

    it('should set next cursor to null on last page', () => {
      const input = UnifiedResponseTransformExamples.withTotalCount.input;
      const cursor: CursorDto = { version: 1, $skip: DEFAULT_SKIP, $limit: DEFAULT_LIMIT };
      const result = interceptor.transformResponse(input, cursor);

      expect(result.next).toBeNull();
    });

    it('should generate correct prev cursor for pagination when not on the first page', () => {
      const input = UnifiedResponseTransformExamples.withTotalCount.input;
      const cursor: CursorDto = { version: 1, $skip: 2, $limit: DEFAULT_LIMIT };

      const result = interceptor.transformResponse(input, cursor);

      const expectedPrev = 'eyJ2ZXJzaW9uIjoxLCIkc2tpcCI6MSwiJGxpbWl0IjoyNX0';
      expect(result.prev).toEqual(expectedPrev);
    });

    it('should set prev cursor to null on first page', () => {
      const input = UnifiedResponseTransformExamples.withTotalCount.input;
      const cursor: CursorDto = { version: 1, $skip: DEFAULT_SKIP, $limit: DEFAULT_LIMIT };

      const result = interceptor.transformResponse(input, cursor);

      expect(result.prev).toBeNull();
    });
  });
});
