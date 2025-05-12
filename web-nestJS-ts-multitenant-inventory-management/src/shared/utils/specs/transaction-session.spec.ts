import { vi } from 'vitest';
import { startSessionWithTimeout, commitOrAbortSession } from '../transaction-session';
import { RequestTimeoutException } from '@nestjs/common';
import { TRANSACTION_TIMEOUT_DURATION } from '../../constants/transaction.contant';

const mockLogger = {
  verbose: vi.fn(),
};

const mockTransactionSession = {
  startTransaction: vi.fn(),
  commitTransaction: vi.fn(),
  abortTransaction: vi.fn(),
  endSession: vi.fn(),
};

const mockConnection = {
  startSession: vi.fn().mockResolvedValue(mockTransactionSession),
};

vi.mock('@nestjs/common', () => ({
  Logger: mockLogger,
  RequestTimeoutException: vi.fn(),
}));

describe('#Shared.Utils.Transaction-session', () => {
  describe('.startSessionWithTimeout', () => {
    it('should throw a RequestTimeoutException if transaction times out', async () => {
      const { timeout } = await startSessionWithTimeout(mockConnection as any);

      clearTimeout(timeout);

      expect(() => {
        throw new RequestTimeoutException('Transaction timed out');
      }).toThrow(RequestTimeoutException);
    });
  });

  describe('.commitOrAbortSession', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    it('should commit the transaction when isCommit is true', async () => {
      const timeout = setTimeout(() => {}, TRANSACTION_TIMEOUT_DURATION);

      await commitOrAbortSession(mockTransactionSession as any, timeout, true);

      expect(mockTransactionSession.commitTransaction).toHaveBeenCalledTimes(1);
      expect(mockTransactionSession.endSession).toHaveBeenCalledTimes(1);
      expect(clearTimeoutSpy).toHaveBeenCalledWith(timeout);
    });

    it('should abort the transaction when isCommit is false', async () => {
      const timeout = setTimeout(() => {}, TRANSACTION_TIMEOUT_DURATION);
      await commitOrAbortSession(mockTransactionSession as any, timeout, false);

      expect(mockTransactionSession.abortTransaction).toHaveBeenCalledTimes(1);
      expect(mockTransactionSession.endSession).toHaveBeenCalledTimes(1);
      expect(clearTimeoutSpy).toHaveBeenCalledWith(timeout);
    });
  });
});
