import { CreateUserDto } from '../dtos/create-user.dto';

export function isCreateUserDto(dto: any): dto is CreateUserDto {
  return (
    typeof dto.name === 'string' &&
    typeof dto.email === 'string' &&
    typeof dto.roleId === 'string' &&
    typeof dto.tenantId === 'string' &&
    (typeof dto.nameLocale === 'string' || dto.nameLocale === undefined) &&
    (typeof dto.profileImage === 'string' || dto.profileImage === undefined) &&
    (typeof dto.password === 'string' || dto.password === undefined)
  );
}
