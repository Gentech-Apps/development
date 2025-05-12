import { Logger, RequestTimeoutException } from '@nestjs/common';
import mongoose from 'mongoose';
import { TRANSACTION_TIMEOUT_DURATION } from '../constants/transaction.contant';

export async function startSessionWithTimeout(connection: mongoose.Connection) {
  const transactionSession = await connection.startSession();
  const timeout = setTimeout(() => {
    transactionSession.abortTransaction();
    transactionSession.endSession();

    Logger.verbose('Transaction aborted due to timeout');
    throw new RequestTimeoutException('Transaction timed out');
  }, TRANSACTION_TIMEOUT_DURATION);

  return { transactionSession, timeout };
}

export async function commitOrAbortSession(
  transactionSession: mongoose.ClientSession,
  timeout: NodeJS.Timeout,
  isCommit: boolean,
) {
  try {
    const transactionAction = isCommit ? 'commitTransaction' : 'abortTransaction';
    if (!isCommit) {
      Logger.debug(
        JSON.stringify({
          context: 'Aborting transaction',
          message: 'Transaction aborted due to error',
          resource: 'Transaction session ',
        }),
      );
    }
    await transactionSession[transactionAction]();
  } catch (error) {
    Logger.error('Error during transaction commit/abort', error.message);
    throw error;
  } finally {
    transactionSession.endSession();
    clearTimeout(timeout);
  }
}
