import { toTitleCase } from '../string-operations';
import { ToTitleCaseExamples } from './examples/string-operation.example';

describe('#Shared.Utils.String-operations', () => {
  describe('.toTitleCase', () => {
    it('should convert a single word to title case', () => {
      const { input, expected } = ToTitleCaseExamples.singleWord;
      const output = toTitleCase(input);
      expect(output).toBe(expected);
    });

    it('should convert a sentence to title case', () => {
      const { input, expected } = ToTitleCaseExamples.sentence;
      const output = toTitleCase(input);
      expect(output).toBe(expected);
    });

    it('should handle already title-cased input correctly', () => {
      const { input, expected } = ToTitleCaseExamples.alreadyTitleCase;
      const output = toTitleCase(input);
      expect(output).toBe(expected);
    });

    it('should handle mixed case input correctly', () => {
      const { input, expected } = ToTitleCaseExamples.mixedCase;
      const output = toTitleCase(input);
      expect(output).toBe(expected);
    });

    it('should return an empty string for empty input', () => {
      const { input, expected } = ToTitleCaseExamples.emptyString;
      const output = toTitleCase(input);
      expect(output).toBe(expected);
    });

    it('should handle input with special characters correctly', () => {
      const { input, expected } = ToTitleCaseExamples.specialCharacters;
      const output = toTitleCase(input);
      expect(output).toBe(expected);
    });
  });
});
