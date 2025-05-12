import { HttpMethods } from '../enums/http-methods.enum';

export function generateResponseMessage(action: HttpMethods): string {
  switch (action) {
    case HttpMethods.POST:
      return 'created';
    case HttpMethods.PATCH:
      return 'updated';
    case HttpMethods.DELETE:
      return 'deleted';
  }
}
