export const RoleExamples = {
  create: {
    ok: {
      body: {
        name: 'Super Admin',
        tenantId: '5f93855d942f74000025f075',
        scopes: [
          {
            entity: 'tenants',
            read: {
              self: true,
              all: true,
            },
            write: {
              self: true,
              all: true,
            },
          },
        ],
      },
      expected: {
        output: {
          _id: '673ef635d667f6efee423050',
          role: 'Super Admin',
          tenantId: '5f93855d942f74000025f075',
          scopes: [
            {
              entity: 'tenants',
              read: {
                self: true,
                all: true,
              },
              write: {
                self: true,
                all: true,
              },
            },
          ],
          isActive: true,
          isDeleted: false,
          createdAt: '2024-11-21T08:58:29.230Z',
          updatedAt: '2024-11-21T08:58:29.230Z',
          __v: 0,
        },
      },
    },
    badRequest: {
      body: {
        name: 'Super Admin',
      },
    },
  },
  list: {
    ok: {
      expected: {
        output: [
          {
            _id: '673497d0f308161e0188d57f',
            role: 'Super Admin',
            tenantId: '5f93855d942f74000025f075',
            scopes: [
              {
                entity: 'tenants',
                read: {
                  self: true,
                  all: true,
                },
                write: {
                  self: true,
                  all: true,
                },
              },
            ],
            isActive: true,
            isDeleted: false,
            createdAt: '2024-11-13T12:13:04.313Z',
            updatedAt: '2024-11-13T12:13:04.313Z',
            __v: 0,
          },
          {
            _id: '67349a51f308161e0188d581',
            role: 'Admin',
            tenantId: '5f93855d942f74000025f075',
            scopes: [
              {
                read: {
                  self: true,
                  all: false,
                },
                write: {
                  self: true,
                  all: false,
                },
              },
            ],
            isActive: true,
            isDeleted: false,
            createdAt: '2024-11-13T12:23:45.855Z',
            updatedAt: '2024-11-13T12:23:45.855Z',
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
          _id: '6734a69e0be95ff2fd5fe24c',
          role: 'Admin',
          tenantId: '5f93855d942f74000025f075',
          scopes: [
            {
              entity: 'tenants',
              read: {
                self: true,
                all: false,
              },
            },
          ],
          isActive: true,
          isDeleted: false,
          createdAt: '2024-11-13T13:16:14.694Z',
          updatedAt: '2024-11-13T13:16:14.694Z',
          __v: 0,
        },
      },
    },
  },
  update: {
    ok: {
      body: {
        role: 'Super Admin1',
        isActive: true,
        isDeleted: false,
        scopes: [
          {
            entity: 'tenants',
            read: {
              self: false,
              all: false,
            },
            write: {
              self: false,
              all: false,
            },
          },
          {
            entity: 'users',
            read: {
              self: true,
              all: true,
            },
            write: {
              self: true,
              all: false,
            },
          },
        ],
      },
      expected: {
        output: {
          _id: '673efe732298efb22f35401b',
          role: 'Super Admin1',
          tenantId: '5f93855d942f74000025f075',
          scopes: [
            {
              entity: 'tenants',
              read: {
                self: false,
                all: false,
              },
              write: {
                self: false,
                all: false,
              },
            },
            {
              entity: 'users',
              read: {
                self: true,
                all: true,
              },
              write: {
                self: true,
                all: false,
              },
            },
          ],
          isActive: true,
          isDeleted: false,
          createdAt: '2024-11-21T09:33:39.522Z',
          updatedAt: '2024-11-21T10:14:39.611Z',
          __v: 0,
        },
      },
    },
    notFound: {
      body: {
        role: 'Super Admin',
        isActive: true,
        isDeleted: false,
        scopes: [
          {
            entity: 'tenants',
            read: {
              self: true,
              all: false,
            },
            write: {
              self: false,
              all: false,
            },
          },
        ],
      },
    },
    patch: {
      ok: {
        body: {
          scopes: [
            {
              entity: 'tenants',
              read: {
                self: false,
                all: false,
              },
              write: {
                self: false,
                all: false,
              },
            },
            {
              entity: 'users',
              read: {
                self: true,
                all: true,
              },
              write: {
                self: true,
                all: false,
              },
            },
          ],
        },
        expected: {
          output: {
            _id: '673efe732298efb22f35401b',
            role: 'Super Admin',
            tenantId: '5f93855d942f74000025f075',
            scopes: [
              {
                entity: 'tenants',
                read: {
                  self: false,
                  all: false,
                },
                write: {
                  self: false,
                  all: false,
                },
              },
              {
                entity: 'users',
                read: {
                  self: true,
                  all: true,
                },
                write: {
                  self: true,
                  all: false,
                },
              },
            ],
            isActive: true,
            isDeleted: false,
            createdAt: '2024-11-21T09:33:39.522Z',
            updatedAt: '2024-11-21T10:14:39.611Z',
            __v: 0,
          },
        },
      },
    },
  },
};
