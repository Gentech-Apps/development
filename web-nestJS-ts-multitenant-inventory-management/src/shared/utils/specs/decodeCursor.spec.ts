import { decodeCursor } from '../decodeCursor';
import { CursorDto } from '../../dto/unified-pagination.dto';
import { DEFAULT_CURSOR_STRING } from '../../constants/pagination.constant';

describe('#Shared.Utils.decodeCursor', () => {
  it('should decode a valid base64url encoded cursor', () => {
    const cursorDto: CursorDto = { version: 1, $skip: 0, $limit: 25 };
    const encodedCursor = Buffer.from(JSON.stringify(cursorDto)).toString('base64url');

    const result = decodeCursor(encodedCursor);
    expect(result).toEqual(cursorDto);
  });

  it('should return the default cursor when cursor is undefined', () => {
    const defaultCursor = JSON.parse(
      Buffer.from(DEFAULT_CURSOR_STRING, 'base64url').toString('utf-8'),
    );

    const result = decodeCursor(undefined);
    expect(result).toEqual(defaultCursor);
  });

  it('should throw an error for an invalid base64url cursor', () => {
    const invalidCursor = 'InvalidBase64String';
    expect(() => decodeCursor(invalidCursor)).toThrow();
  });

  it('should throw an error if cursor JSON is invalid', () => {
    const invalidJsonCursor = Buffer.from('Invalid JSON').toString('base64url');

    expect(() => decodeCursor(invalidJsonCursor)).toThrow();
  });
});
