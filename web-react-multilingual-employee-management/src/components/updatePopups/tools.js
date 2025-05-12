export const calculateUsers = (resources) => {
  const currentResources = resources.reduce((result, subDepartment) => {
    const resources = subDepartment?.resources;
    if (resources) {
      const addedResources = resources.filter((i) => i.current);
      result = [...result, ...addedResources];
    }
    return result;
  }, []);

  const users = Object.keys(
    currentResources.reduce((result, resource) => {
      const { _id } = resource;
      result[_id] = resource;
      return result;
    }, {}),
  );

  const usersQuantity = users.length;

  return usersQuantity;
};
