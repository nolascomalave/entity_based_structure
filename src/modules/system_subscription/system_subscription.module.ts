import { Module } from '@nestjs/common';
import { SystemSubscriptionController } from './interface/http/controllers/system_subscription.controller';

@Module({
    controllers: [SystemSubscriptionController],
    /* providers: [PrismaService, SystemSubscriptionService, JwtService],
    imports: [SystemSubscriptionDocumentModule, SystemSubscriptionNameModule, SystemSubscriptionEmailModule, SystemSubscriptionPhoneModule],
    exports: [SystemSubscriptionService] */
})
export class SystemSubscriptionModule {}