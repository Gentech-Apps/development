import { Logger } from '@nestjs/common';
import { DEFAULT_CURSOR_STRING } from '../constants/pagination.constant';
import { CursorDto } from '../dto/unified-pagination.dto';

export function decodeCursor(cursor: string | undefined): CursorDto | undefined {
  try {
    const defaultCursorString = DEFAULT_CURSOR_STRING;
    const cursorToUse = cursor ? cursor : defaultCursorString;
    const decodedString = Buffer.from(cursorToUse, 'base64url').toString('utf-8');
    const parsedCursor = JSON.parse(decodedString);
    return parsedCursor;
  } catch (error) {
    Logger.verbose(
      JSON.stringify({
        context: 'Error creating record',
        message: error.message,
        resource: decodeCursor.name,
      }),
    );
    throw error;
  }
}
