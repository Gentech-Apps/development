export interface IApiParams {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  query?: any;
  body?: any;
  noAuth?: boolean;
  multipart?: boolean;
  isCompiler?: boolean;
}
