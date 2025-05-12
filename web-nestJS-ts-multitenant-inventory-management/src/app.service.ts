import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `canteen-mgmt-app is running on port ${process.env.PORT}!`;
  }
}
