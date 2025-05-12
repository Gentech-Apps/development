export const DEFAULT_TEST_SYSTEM_TIME = new Date('2023-05-30T00:00:00.000Z');

vi.useFakeTimers();
vi.setSystemTime(DEFAULT_TEST_SYSTEM_TIME);

// INFO: Global afterEach are run in conjuction with local test file defined afterEach/afterAll etc.
afterEach(() => {
  vi.clearAllTimers();

  vi.setSystemTime(DEFAULT_TEST_SYSTEM_TIME);
});
