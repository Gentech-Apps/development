import {
  isBoolean,
  isMissing,
  isMissingOrEmpty,
  isNumber,
  isObject,
  isString,
  isUnifiedListQueryResponseDto,
  isUnifiedListStructure,
  notMissing,
} from '../typecheck';
import { UnifiedListStructureExamples } from './examples/unified-list-structure.example';

describe('#Typecheck', () => {
  describe('.isMissing', () => {
    it('should return true', () => {
      const input = null;
      const output = isMissing(input);

      expect(output).toBe(true);
    });

    it('should return false', () => {
      const input = { name: 'john' };
      const output = isMissing(input);

      expect(output).toBe(false);
    });
  });

  describe('.notMissing', () => {
    it('should return true', () => {
      const input = null;
      const output = notMissing(input);

      expect(output).toBe(false);
    });

    it('should return false', () => {
      const input = {};
      const output = notMissing(input);

      expect(output).toBe(true);
    });
  });

  describe('.isMissingOrEmpty', () => {
    it('should return true', () => {
      const input = '';
      const output = isMissingOrEmpty(input);

      expect(output).toBe(true);
    });

    it('should return false', () => {
      const input = 'sample text';
      const output = isMissingOrEmpty(input);

      expect(output).toBe(false);
    });
  });

  describe('.isObject', () => {
    it('should return true', () => {
      const input = { name: 'john' };
      const output = isObject(input);

      expect(output).toBe(true);
    });

    it('should return false', () => {
      const input = 'sample text';
      const output = isObject(input);

      expect(output).toBe(false);
    });
  });

  describe('.isString', () => {
    it('should return true', () => {
      const input = 'sample text';
      const output = isString(input);

      expect(output).toBe(true);
    });

    it('should return false', () => {
      const input = { name: 'john' };
      const output = isString(input);

      expect(output).toBe(false);
    });
  });

  describe('.isBoolean', () => {
    it('should return true', () => {
      const input = true;
      const output = isBoolean(input);

      expect(output).toBe(true);
    });

    it('should return false', () => {
      const input = 'true';
      const output = isBoolean(input);

      expect(output).toBe(false);
    });
  });

  describe('.isNumber', () => {
    it('should return true', () => {
      const input = 123;
      const output = isNumber(input);

      expect(output).toBe(true);
    });

    it('should return false', () => {
      const input = '123';
      const output = isNumber(input);

      expect(output).toBe(false);
    });
  });

  describe('.isUnifiedListQueryResponseDto', () => {
    it('should return true for valid response with totalCount as number', () => {
      const validResponse = { data: [{ id: 1, name: 'Test' }], totalCount: 10 };
      expect(isUnifiedListQueryResponseDto(validResponse)).toBe(true);
    });

    it('should return false if totalCount is not a number', () => {
      const invalidResponse = { data: [{ id: 1, name: 'Test' }], totalCount: 'Invalid count' };
      expect(isUnifiedListQueryResponseDto(invalidResponse)).toBe(false);
    });

    it('should return false if totalCount is missing', () => {
      const invalidResponse = { data: [{ id: 1, name: 'Test' }] };
      expect(isUnifiedListQueryResponseDto(invalidResponse)).toBe(false);
    });

    it('should return false if data is not an array', () => {
      const invalidResponse = { data: 'Invalid data', totalCount: 10 };
      expect(isUnifiedListQueryResponseDto(invalidResponse)).toBe(false);
    });

    it('should return false if object does not match', () => {
      const completelyInvalidResponse = { someOtherField: 'Invalid' };
      expect(isUnifiedListQueryResponseDto(completelyInvalidResponse)).toBe(false);
    });

    it('should return true if cursor.next is null', () => {
      const responseWithNullNext = {
        data: [{ id: 1, name: 'Test' }],
        totalCount: 1,
        next: null,
        prev: 'eyJ2ZXJzaW9uIjogMSwgImZsYWciOiAibmV4dCIsICIkc2tpcCI6IDAsICIkbGltaXQiOiAyNX0=',
      };
      expect(isUnifiedListQueryResponseDto(responseWithNullNext)).toBe(true);
    });

    it('should return true if cursor.prev is null', () => {
      const responseWithNullNext = {
        data: [{ id: 1, name: 'Test' }],
        totalCount: 1,
        next: 'eyJ2ZXJzaW9uIjogMSwgImZsYWciOiAibmV4dCIsICIkc2tpcCI6IDAsICIkbGltaXQiOiAyNX0=',
        prev: null,
      };
      expect(isUnifiedListQueryResponseDto(responseWithNullNext)).toBe(true);
    });
  });

  describe('.isUnifiedListStructure', () => {
    it('should correctly handle valid withTotalCount structure', () => {
      const { input, expected } = UnifiedListStructureExamples.withTotalCount;
      expect(isUnifiedListStructure(input)).toEqual(expected);
    });

    it('should correctly handle valid withoutTotalCount structure', () => {
      const { input, expected } = UnifiedListStructureExamples.withoutTotalCount;
      expect(isUnifiedListStructure(input)).toEqual(expected);
    });
  });
});
