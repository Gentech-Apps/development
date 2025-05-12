import { getMatchingEntity } from '../get-matching-entity';

describe('#Shared.Utils.Get-matching-entity', () => {
  it('should return "users" for route "api/users/:id"', () => {
    expect(getMatchingEntity('api/users/:id')).toBe('users');
  });

  it('should return "tenants" for route "api/tenants/:tenantId/comments/:commentId"', () => {
    expect(getMatchingEntity('api/tenants/:tenantsId/comments/:commentId')).toBe('tenants');
  });

  it('should return undefined for route "api/products/:id"', () => {
    expect(getMatchingEntity('api/products/:id')).toBeUndefined();
  });

  it('should return "users" for route "api/Users/:id"', () => {
    expect(getMatchingEntity('api/Users/:id')).toBe('users');
  });

  it('should return "users" for route "api//users///:id"', () => {
    expect(getMatchingEntity('api//users///:id')).toBe('users');
  });

  it('should return undefined for empty route', () => {
    expect(getMatchingEntity('')).toBeUndefined();
  });

  it('should return "users" for route "api/users/someId"', () => {
    expect(getMatchingEntity('api/users/someId')).toBe('users');
  });

  it('should return undefined for route "api/"', () => {
    expect(getMatchingEntity('api/')).toBeUndefined();
  });

  it('should return "users" for route "api/user/:userId/details"', () => {
    expect(getMatchingEntity('api/users/:userId/details')).toBe('users');
  });
});
