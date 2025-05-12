import { Injectable, PipeTransform, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class GlobalQueryPipe implements PipeTransform {
  constructor(@Inject(REQUEST) protected readonly request: Request) {}

  transform(value: any) {
    const user = this.request['user'];
    value.tenantId = user.tenant_id;
    return value;
  }
}
