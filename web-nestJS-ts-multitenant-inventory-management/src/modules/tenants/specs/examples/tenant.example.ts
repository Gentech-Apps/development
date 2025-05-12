export const TenantExamples = {
  create: {
    ok: {
      body: {
        companyName: 'test',
        country: 'US',
        secondaryLanguage: 'jpn',
        currency: 'AFN',
      },
      expected: {
        output: {
          companyName: 'test',
          domainUrl: 'test.genesisapps.in',
          primaryLanguage: 'en',
          countryDetails: {
            name: 'Afghanistan',
            altName: 'افغانستان',
            ISO31661A2: 'AF',
            ISO31661A3: 'AFG',
          },
          secondaryLanguageDetails: {
            name: 'Japanese',
            altName: '日本語 (Nihongo)',
            ISO6391: 'ja',
            ISO6392: 'jpn',
            ISO6393: 'jpn',
          },
          currencyDetails: {
            name: 'Afghan Afghani',
            altName: '',
            countryName: 'Afghanistan',
            symbol: '؋',
            ISO4217: 'AFN',
          },
          _id: '6723257c48b6905036bd656d',
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
      },
    },
    badRequest: {
      body: {
        country: 'IN',
      },
    },
  },
  list: {
    ok: {
      expected: {
        output: [
          {
            companyName: 'test',
            domainUrl: 'test.genesisapps.in',
            primaryLanguage: 'en',
            countryDetails: {
              name: 'Afghanistan',
              altName: 'افغانستان',
              ISO31661A2: 'AF',
              ISO31661A3: 'AFG',
            },
            secondaryLanguageDetails: {
              name: 'Japanese',
              altName: '日本語 (Nihongo)',
              ISO6391: 'ja',
              ISO6392: 'jpn',
              ISO6393: 'jpn',
            },
            currencyDetails: {
              name: 'Afghan Afghani',
              altName: '',
              countryName: 'Afghanistan',
              symbol: '؋',
              ISO4217: 'AFN',
            },
            _id: '6723257c48b6905036bd656d',
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
          },
          {
            companyName: 'test2',
            domainUrl: 'test2.genesisapps.in',
            primaryLanguage: 'en',
            countryDetails: {
              name: 'Afghanistan',
              altName: 'افغانستان',
              ISO31661A2: 'AF',
              ISO31661A3: 'AFG',
            },
            secondaryLanguageDetails: {
              name: 'Japanese',
              altName: '日本語 (Nihongo)',
              ISO6391: 'ja',
              ISO6392: 'jpn',
              ISO6393: 'jpn',
            },
            currencyDetails: {
              name: 'Afghan Afghani',
              altName: '',
              countryName: 'Afghanistan',
              symbol: '؋',
              ISO4217: 'AFN',
            },
            _id: '6723257c48b6905036bd656e',
            createdAt: new Date(),
            updatedAt: new Date(),
            __v: 0,
          },
        ],
      },
    },
  },
  get: {
    ok: {
      expected: {
        output: {
          companyName: 'test',
          domainUrl: 'test.genesisapps.in',
          primaryLanguage: 'en',
          countryDetails: {
            name: 'Afghanistan',
            altName: 'افغانستان',
            ISO31661A2: 'AF',
            ISO31661A3: 'AFG',
          },
          secondaryLanguageDetails: {
            name: 'Japanese',
            altName: '日本語 (Nihongo)',
            ISO6391: 'ja',
            ISO6392: 'jpn',
            ISO6393: 'jpn',
          },
          currencyDetails: {
            name: 'Afghan Afghani',
            altName: '',
            countryName: 'Afghanistan',
            symbol: '؋',
            ISO4217: 'AFN',
          },
          _id: '6723257c48b6905036bd656d',
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
      },
    },
  },
  update: {
    ok: {
      body: {
        country: 'CN',
      },
      expected: {
        output: {
          companyName: 'test123',
          domainUrl: 'test123.genesisapps.in',
          primaryLanguage: 'en',
          countryDetails: {
            name: 'China',
            altName: '中国',
            ISO31661A2: 'CN',
            ISO31661A3: 'CHN',
          },
          secondaryLanguageDetails: {
            name: 'Japanese',
            altName: '日本語 (Nihongo)',
            ISO6391: 'ja',
            ISO6392: 'jpn',
            ISO6393: 'jpn',
          },
          currencyDetails: {
            name: 'Afghan Afghani',
            altName: '',
            countryName: 'Afghanistan',
            symbol: '؋',
            ISO4217: 'AFN',
          },
          _id: '6723257c48b6905036bd656d',
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
      },
    },
    notFound: {
      body: {
        country: 'XX',
      },
    },
  },
};
