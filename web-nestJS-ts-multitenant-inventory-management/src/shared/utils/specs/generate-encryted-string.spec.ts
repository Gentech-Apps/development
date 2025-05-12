import { generateEncryptedString, transformHeader } from '../generate-encypted-string';
import { vi } from 'vitest';

vi.mock('crypto', () => ({
  createHash: vi.fn(() => ({
    update: vi.fn().mockReturnThis(),
    digest: vi.fn().mockReturnValue('mockedHashResult'),
  })),
}));

describe('#Shared.Utils', () => {
  describe('.generateEncryptedString', () => {
    it('should generate a Base64 encoded encrypted string', () => {
      const input = 'testInput';
      const result = generateEncryptedString(input);
      expect(result).toBe('YgrkYHmOH0yrRMRPMIViAoTwlgona7w/C9QWRJ3xTb4=');
    });

    it('should return a Base64 string even if the input is an empty string', () => {
      const input = '';
      const result = generateEncryptedString(input);
      expect(result).toBe('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=');
    });
  });

  describe('transformHeader', () => {
    it('should encrypt x-account-key and authorization values in headers', () => {
      const headers = {
        'x-account-key': 'apiKey123',
        authorization: 'authToken456',
      };

      const transformedHeaders = transformHeader(headers);

      expect(transformedHeaders['x-account-key']).toBe(
        'S57w1KAdYyfgT5VrH7fvjsisVpuPARRKfUHebUcElGM=',
      );
      expect(transformedHeaders.authorization).toBe('wfoVKjTwc5WHXKqB/DaIrMHraK9NqdMalscu8fvXB+E=');
    });

    it('should not modify headers that do not contain x-account-key or authorization', () => {
      const headers = {
        'content-type': 'application/json',
        'x-custom-header': 'customValue',
      };

      const transformedHeaders = transformHeader(headers);

      expect(transformedHeaders['content-type']).toBe('application/json');
      expect(transformedHeaders['x-custom-header']).toBe('customValue');
    });

    it('should handle missing x-account-key and authorization gracefully', () => {
      const headers = {};

      const transformedHeaders = transformHeader(headers);

      expect(transformedHeaders).toEqual({});
    });
  });
});
