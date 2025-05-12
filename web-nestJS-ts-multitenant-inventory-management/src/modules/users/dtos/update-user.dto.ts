import { PickType } from '@nestjs/swagger';
import { User } from '../schema/user.schema';

export class UpdateUserDto extends PickType(User, [
  'name',
  'nameLocale',
  'profileImage',
  'roleId',
  'notificationToken',
  'deviceId',
  'isActive',
  'isDeleted',
]) {}
