import { MultipartMulterFileModel } from '../models/files.model';

export const getFileName = (filename: string): string => {
  return replaceSpecialCharactersWithHyphen(filename?.trim()?.toString()?.split('.')?.[0]);
};

export const getFileExtension = (filename: string): string => {
  return filename?.trim()?.toString()?.split('.')?.pop();
};

export const replaceSpecialCharactersWithHyphen = (filename: string): string => {
  return filename?.replace(/[^\w\-]+/g, '-');
};

export const getS3FileKey = (
  identifier: string,
  { originalname }: MultipartMulterFileModel,
  s3Path: string,
): string => {
  const filename = getFileName(originalname);
  const extension = getFileExtension(originalname);
  return `${s3Path}/${identifier?.replaceAll('-', '')}/${Date.now()}-${filename}.${extension}`;
};

export const getS3ObjectUrl = (bucket: string, fileKey: string): string => {
  return `https://${bucket}.s3.amazonaws.com/${fileKey}`;
};
