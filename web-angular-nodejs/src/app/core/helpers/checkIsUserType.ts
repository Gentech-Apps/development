import { UserTypes } from '../enums/UserType';

export const checkIsNotExaminee = (userType: string): boolean => {
  return userType.toLowerCase() !== UserTypes.EXAMINEE;
};

export const isAdmin = (userType: string) => {
  return (
    userType.toLowerCase() == UserTypes.ADMIN || userType.toLowerCase() == UserTypes.SUPERADMIN
  );
};

export const isExaminer = (userType: string) => {
  return (
    userType.toLowerCase() == UserTypes.ADMIN ||
    userType.toLowerCase() == UserTypes.SUPERADMIN ||
    userType.toLowerCase() == UserTypes.EXAMINER
  );
};

export const isInvigilator = (userType: string) => {
  return (
    userType.toLowerCase() == UserTypes.ADMIN ||
    userType.toLowerCase() == UserTypes.SUPERADMIN ||
    userType.toLowerCase() == UserTypes.INVIGILATOR
  );
};

export const isSuperAdmin = (userType: string) => {
  return userType.toLowerCase() == UserTypes.SUPERADMIN;
};
