export const ENTITY_DEPENDENCY_PERMISSION = [
  {
    entity: 'users',
    dependencies: [
      {
        entity: 'roles',
      },
    ],
  },
  {
    entity: 'items',
    dependencies: [
      {
        entity: 'categories',
      },
    ],
  },
  {
    entity: 'feedbacks',
    dependencies: [
      {
        entity: 'items',
      },
    ],
  },
];
