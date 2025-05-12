export const ToTitleCaseExamples = {
  singleWord: {
    input: 'hello',
    expected: 'Hello',
  },
  sentence: {
    input: 'this is a test sentence',
    expected: 'This Is A Test Sentence',
  },
  alreadyTitleCase: {
    input: 'This Is A Title',
    expected: 'This Is A Title',
  },
  mixedCase: {
    input: 'tHiS Is a MIXed cASE inPUT',
    expected: 'This Is A Mixed Case Input',
  },
  emptyString: {
    input: '',
    expected: '',
  },
  specialCharacters: {
    input: 'hello! how are you?',
    expected: 'Hello! How Are You?',
  },
};
