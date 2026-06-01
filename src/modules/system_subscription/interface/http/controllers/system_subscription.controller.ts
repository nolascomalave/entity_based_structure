import { Controller, Get } from '@nestjs/common';

@Controller('system_subscription')
export class SystemSubscriptionController {
  constructor() {}

  @Get()
  getHello(): string {
    return "Hello! This is a System Subscription.";
  }
}
