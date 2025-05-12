export const SuggestionExamples = {
  create: {
    ok: {
      body: {
        title: 'Feature request',
        description: 'Add a dark mode option',
        userId: '5f93855d942f74000025f075',
        tenantId: '5f93855d942f74000025f075',
      },
      expected: {
        output: {
          _id: '63fba61a4d8f1a0024bfc9d2',
          title: 'Feature request',
          description: 'Add a dark mode option',
          userId: '5f93855d942f74000025f075',
          tenantId: '5f93855d942f74000025f075',
          createdAt: new Date(),
          updatedAt: new Date(),
          __v: 0,
        },
      },
    },
    badRequest: {
      body: {
        description: 'sample description',
        userId: '5f93855d942f74000025f075',
        tenantId: '5f93855d942f74000025f075',
      },
    },
  },
  list: {
    ok: {
      expected: {
        output: [
          {
            _id: '673ec4d7f64086f8b656e7bc',
            title: 'New snack suggestion',
            description: 'We should add new items for snacks because current items are widespread.',
            userId: '672f2ad0f8621e04971c0631',
            tenantId: '67235e84f4d71f1cd3a9ee5a',
            createdAt: '2024-11-21T05:27:51.439Z',
            updatedAt: '2024-11-21T05:27:51.439Z',
            __v: 0,
          },
          {
            _id: '673ec4e1f64086f8b656e7be',
            title: 'New snack suggestion1',
            description:
              'We should add new items for snacks because current items are1 widespread.',
            userId: '672f2ad0f8621e04971c0631',
            tenantId: '67235e84f4d71f1cd3a9ee5a',
            createdAt: '2024-11-21T05:28:01.572Z',
            updatedAt: '2024-11-21T05:28:01.572Z',
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
          _id: '673ec4d7f64086f8b656e7bc',
          title: 'New snack suggestion',
          description: 'We should add new items for snacks because current items are widespread.',
          userId: '672f2ad0f8621e04971c0631',
          tenantId: '6723257c48b6905036bd656e',
          createdAt: '2024-11-21T05:27:51.439Z',
          updatedAt: '2024-11-21T05:27:51.439Z',
          __v: 0,
        },
      },
    },
  },
  update: {
    ok: {
      body: {
        title: 'New snack suggestion123',
        description: 'We should add new items for snacks because current items are widespread',
      },
      expected: {
        output: {
          _id: '673f19dc2ecec3b2cd5c2134',
          title: 'New snack suggestion123',
          description: 'We should add new items for snacks because current items are widespread.',
          userId: '6735ff7225b315c04d0ffd90',
          tenantId: '6735ff7225b315c04d0ffd90',
          createdAt: '2024-11-21T11:30:36.918Z',
          updatedAt: '2024-11-21T11:31:57.770Z',
          __v: 0,
        },
      },
    },
    notFound: {
      body: {
        title: '',
      },
    },
  },
};
