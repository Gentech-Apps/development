import { Injectable, PipeTransform, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class GlobalPathParamPipe implements PipeTransform {
  constructor(@Inject(REQUEST) protected readonly request: Request) {}

  transform(value: any) {
    if (typeof value === 'string') {
      const user = this.request['user'];
      return {
        id: value,
        tenantId: user.tenant_id,
      };
    }
    return value;
  }
}
