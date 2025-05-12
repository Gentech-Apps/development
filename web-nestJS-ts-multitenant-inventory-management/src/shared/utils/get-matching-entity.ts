import { ApiControllerTag } from '../../swagger/tags';

/**
 * This function retrieves a matching entity tag from a given route path.
 * It splits the route path into segments and checks each segment against the available entity tags.
 * If a matching tag is found, it is returned. Otherwise, `undefined` is returned.
 *
 * @param routePath - The route path to be analyzed.
 * @returns The matching entity tag if found, or `undefined` if no match is found.
 * @example - routePath = 'api/users/:id' output = users
 */
export function getMatchingEntity(routePath: string): string | undefined {
  const pathSegments = routePath.split('/');

  for (const segment of pathSegments) {
    const matchingTag = Object.values(ApiControllerTag).find(
      (tag) => tag.toLowerCase() === segment.toLowerCase(),
    );
    if (matchingTag) {
      return matchingTag;
    }
  }

  return undefined;
}
