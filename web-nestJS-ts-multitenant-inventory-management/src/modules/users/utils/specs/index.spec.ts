import { isCreateUserDto } from '../index';
import { CreateUserDto } from '../../dtos/create-user.dto';

describe('.isCreateUserDto', () => {
  it('should return true for a valid CreateUserDto object', () => {
    const validDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      roleId: 'admin',
      tenantId: 'tenant123',
      nameLocale: 'en',
      profileImage: 'image.jpg',
      password: 'password123',
    };

    expect(isCreateUserDto(validDto)).toBe(true);
  });

  it('should return true when optional fields are undefined', () => {
    const validDtoWithUndefinedOptionalFields: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      roleId: 'admin',
      tenantId: 'tenant123',
      nameLocale: undefined,
      profileImage: undefined,
      password: undefined,
    };

    expect(isCreateUserDto(validDtoWithUndefinedOptionalFields)).toBe(true);
  });

  it('should return false if required fields are missing', () => {
    const invalidDto = {
      email: 'john.doe@example.com',
      roleId: 'admin',
      tenantId: 'tenant123',
    };

    expect(isCreateUserDto(invalidDto)).toBe(false);
  });

  it('should return true even if some optional fields are missing', () => {
    const validDtoWithMissingOptionalFields: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      roleId: 'admin',
      tenantId: 'tenant123',
      nameLocale: 'en',
      profileImage: undefined,
      password: 'password123',
    };

    expect(isCreateUserDto(validDtoWithMissingOptionalFields)).toBe(true);
  });
});
