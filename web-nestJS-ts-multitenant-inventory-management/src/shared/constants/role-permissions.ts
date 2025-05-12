export const ROLES_WITH_PERMISSIONS = {
  'Super Admin': {
    read: { self: true, all: true },
    write: { self: true, all: true },
  },
  Admin: {
    read: { self: true, all: true },
    write: { self: true, all: true },
  },
  User: {
    read: { self: true, all: false },
    write: { self: true, all: false },
  },
};

export const ROLES_WITH_PERMISSIONS_SEEDER = {
  'Master Admin': {
    read: { self: true, all: true },
    write: { self: true, all: true },
  },
  'Super Admin': {
    read: { self: true, all: true },
    write: { self: true, all: true },
  },
  Admin: {
    read: { self: true, all: true },
    write: { self: true, all: true },
  },
  User: {
    read: { self: true, all: false },
    write: { self: true, all: false },
  },
};
