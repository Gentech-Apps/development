export const CategoryExamples = {
  create: {
    ok: {
      body: {
        tenantId: '672dbe88dfeacf83f6cb2231',
        name: 'Lunch',
        nameLocale: 'らんち',
        lastModifiedBy: '672dbe88dfeacf83f6cb2231',
      },
      expected: {
        tenantId: '672dbe88dfeacf83f6cb2231',
        name: 'Lunch',
        nameLocale: 'らんち',
        parentCategoryId: null,
        lastModifiedBy: '672dbe88dfeacf83f6cb2231',
        isActive: true,
        isDeleted: false,
        _id: '6736ef6564ab7c9fa6ba8209',
        updatedAt: '2024-11-15T06:51:17.444Z',
        createdAt: '2024-11-15T06:51:17.444Z',
        __v: 0,
      },
    },
    badRequest: {
      body: {
        name: '',
      },
    },
  },
  list: {
    ok: {
      expected: {
        output: [
          {
            _id: '6736ef6564ab7c9fa6ba8209',
            tenantId: '672dbe88dfeacf83f6cb2231',
            name: 'Lunch',
            nameLocale: 'らんち',
            parentCategoryId: null,
            isEnabled: true,
            isDeleted: false,
            createdAt: '2024-11-15T06:51:17.444Z',
            updatedAt: '2024-11-15T06:51:17.444Z',
            __v: 0,
          },
          {
            _id: '6736f82d0e2dc7f34279e8f0',
            tenantId: '672dbe88dfeacf83f6cb2231',
            name: 'Lunch',
            nameLocale: 'らんち',
            parentCategoryId: null,
            addedByUserId: '672dbe88dfeacf83f6cb2231',
            isEnabled: true,
            isDeleted: false,
            createdAt: '2024-11-15T07:28:45.493Z',
            updatedAt: '2024-11-15T07:28:45.493Z',
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
          isActive: true,
          _id: '6737296906d876296b1f6775',
          tenantId: '672dbe88dfeacf83f6cb2231',
          name: 'Lunch',
          nameLocale: 'らんち',
          parentCategoryId: null,
          lastModifiedBy: '672dbe88dfeacf83f6cb2231',
          isEnabled: true,
          isDeleted: false,
          createdAt: '2024-11-15T10:58:49.191Z',
          updatedAt: '2024-11-15T10:58:49.191Z',
          __v: 0,
        },
      },
    },
  },
  update: {
    ok: {
      body: {
        name: 'Dinner',
        nameLocale: 'ディナー',
        lastModifiedBy: '672dbe88dfeacf83f6cb2231',
      },
      expected: {
        tenantId: '672dbe88dfeacf83f6cb2231',
        name: 'Dinner',
        nameLocale: 'ディナー',
        parentCategoryId: null,
        lastModifiedBy: '672dbe88dfeacf83f6cb2231',
        isActive: true,
        isDeleted: false,
        _id: '6736ef6564ab7c9fa6ba8209',
        updatedAt: '2024-11-16T06:51:17.444Z',
        createdAt: '2024-11-15T06:51:17.444Z',
        __v: 0,
      },
    },
    badRequest: {
      body: {
        name: '',
      },
    },
  },
};
