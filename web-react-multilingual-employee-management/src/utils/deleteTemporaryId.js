import { REG_EXP_OBJECT_ID } from '../constants';

export const deleteTemporaryIdFromObject = (value) => {
  if (
    !value?._id.match(
      REG_EXP_OBJECT_ID,
    ) /*length of mongo ObjectId (60783b7cd8096e80215e5fb2) is 24 characters uuid() for temporary id is longer */
  ) {
    delete value._id;
    return value;
  }
  return value;
};

export const matchObjectId = (value) => (value.match(REG_EXP_OBJECT_ID) ? value : '');
