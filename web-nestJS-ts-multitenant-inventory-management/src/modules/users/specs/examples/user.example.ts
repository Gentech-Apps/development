export const UserExamples = {
  create: {
    ok: {
      body: {
        nameLocale: 'John Doe',
        password: 'User@1234',
        profileImage: 'string',
        name: 'John Doe',
        email: 'john.doe@example.com',
        roleId: '67349d90a5e96d650aa8e093',
        tenantId: '5f93855d942f74000025f075',
      },
      expected: {
        output: {
          name: 'John Doe',
          nameLocale: 'John Doe',
          email: 'john.doe@example.com',
          password: 'User@1234',
          roleId: '67349521f85dcfa694cdd827',
          tenantId: '672dbe88dfeacf83f6cb2231',
          profileImage: 'string',
          isActive: true,
          isDeleted: false,
          _id: '673ee182319ba399f6cd9285',
          createdAt: '2024-11-21T07:30:10.842Z',
          updatedAt: '2024-11-21T07:30:10.842Z',
          __v: 0,
        },
      },
    },
    badRequest: {
      body: {
        name: 'John Doe',
      },
    },
  },
  list: {
    ok: {
      expected: {
        output: [
          {
            _id: '6736004b7dd87af10a538219',
            name: 'John Doe',
            nameLocale: 'John Doe',
            email: 'ajjk@example.com',
            password: 'User@1234',
            roleId: '67349521f85dcfa694cdd827',
            tenantId: '672dbe88dfeacf83f6cb2231',
            profileImage: 'string',
            isActive: true,
            isDeleted: false,
            createdAt: '2024-11-14T13:51:07.447Z',
            updatedAt: '2024-11-14T13:51:07.447Z',
            __v: 0,
          },
          {
            _id: '673608b38e8a83677952b759',
            name: 'John Doe',
            nameLocale: 'John Doe',
            email: 'あいうえお@example.com',
            password: 'User@1234',
            roleId: '67349521f85dcfa694cdd827',
            tenantId: '672dbe88dfeacf83f6cb2231',
            profileImage: 'string',
            isActive: true,
            isDeleted: false,
            createdAt: '2024-11-14T14:26:59.110Z',
            updatedAt: '2024-11-14T14:26:59.110Z',
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
          _id: '6723257c48b6905036bd656d',
          name: 'John Doe',
          nameLocale: 'John Doe',
          email: 'ajjk@example.com',
          password: 'User@1234',
          roleId: '67349521f85dcfa694cdd827',
          tenantId: '6723257c48b6905036bd656e',
          profileImage: 'string',
          isActive: true,
          isDeleted: false,
          createdAt: '2024-11-14T13:51:07.447Z',
          updatedAt: '2024-11-14T13:51:07.447Z',
          __v: 0,
        },
      },
    },
  },
  update: {
    ok: {
      body: {
        name: 'Testing 123',
      },
      expected: {
        output: {
          _id: '6736004b7dd87af10a538219',
          name: 'Testing 123',
          nameLocale: 'John Doe',
          email: 'ajjk@example.com',
          password: 'User@1234',
          roleId: '67349521f85dcfa694cdd827',
          tenantId: '672dbe88dfeacf83f6cb2231',
          profileImage: 'string',
          isActive: true,
          isDeleted: false,
          createdAt: '2024-11-14T13:51:07.447Z',
          updatedAt: '2024-11-21T07:42:06.459Z',
          __v: 0,
        },
      },
    },
    notFound: {
      body: {
        name: '',
      },
    },
  },
  validate: {
    ok: {
      body: {
        email: 'john.doe@example.com',
        password: 'user1234@',
        tenantId: '6736004b7dd87af10a538219',
      },
      expected: {
        output: {
          _id: '6736004b7dd87af10a538219',
          email: 'john.doe@example.com',
          password: 'user1234@',
          name: 'Testing 123',
          nameLocale: 'John Doe',
          roleId: '67349521f85dcfa694cdd827',
          tenantId: '672dbe88dfeacf83f6cb2231',
          profileImage: 'string',
          isActive: true,
          isDeleted: false,
          createdAt: '2024-11-14T13:51:07.447Z',
          updatedAt: '2024-11-21T07:42:06.459Z',
          __v: 0,
        },
      },
    },
  },
};
