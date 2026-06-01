import { Global, Module } from '@nestjs/common';
import { DrizzleClientService } from './services/drizzle-client.service';
import { ConfigModule } from '@nestjs/config';

@Global() // Hace que el módulo sea global para no tener que importarlo en cada módulo
@Module({
    imports: [ConfigModule.forRoot()],
    providers: [DrizzleClientService],
    exports: [DrizzleClientService],
})
export class DrizzleModule {}