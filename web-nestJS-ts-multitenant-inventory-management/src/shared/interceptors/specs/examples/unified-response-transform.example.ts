export const UnifiedResponseTransformExamples = {
  withTotalCount: {
    input: [
      {
        data: [
          { companyName: 'test', domainUrl: 'test.genesisapps.in', primaryLanguage: 'en' },
          { companyName: 'test2', domainUrl: 'test2.genesisapps.in', primaryLanguage: 'en' },
          { companyName: 'test3', domainUrl: 'test2.genesisapps.in', primaryLanguage: 'en' },
        ],
        totalCount: 3,
      },
    ],
    expected: {
      data: [
        { companyName: 'test', domainUrl: 'test.genesisapps.in', primaryLanguage: 'en' },
        { companyName: 'test2', domainUrl: 'test2.genesisapps.in', primaryLanguage: 'en' },
        { companyName: 'test3', domainUrl: 'test2.genesisapps.in', primaryLanguage: 'en' },
      ],
      totalCount: 3,
      next: null,
      prev: null,
    },
  },
};
