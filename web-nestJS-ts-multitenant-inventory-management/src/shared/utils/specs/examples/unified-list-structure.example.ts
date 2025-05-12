export const UnifiedListStructureExamples = {
  withTotalCount: {
    input: [
      {
        data: [
          { companyName: 'test', domainUrl: 'test.genesisapps.in', primaryLanguage: 'en' },
          { companyName: 'test2', domainUrl: 'test2.genesisapps.in', primaryLanguage: 'en' },
        ],
        totalCount: [{ totalCount: 2 }],
        cursor: { version: 1, $skip: 1, $limit: 25 },
      },
    ],
    expected: true,
  },
  withoutTotalCount: {
    input: [
      {
        data: [{ companyName: 'test3', domainUrl: 'test3.genesisapps.in', primaryLanguage: 'fr' }],
      },
    ],
    expected: false,
  },
};
