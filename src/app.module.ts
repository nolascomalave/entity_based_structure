import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Modules:
// import { SystemSubscriptionModule } from './modules/system_subscription/system_subscription.module';
import { EntityModule } from './modules/entity/entity.module';
import { DrizzleModule } from './shared/database/drizzle.module';

@Module({
  imports: [
    // SystemSubscriptionModule,
    EntityModule,
    DrizzleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
