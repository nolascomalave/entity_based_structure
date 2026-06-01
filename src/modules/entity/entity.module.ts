import { Module } from '@nestjs/common';
import { EntityController } from './interface/http/controllers/entity.controller';
import { /* CommandBus, */ CqrsModule } from '@nestjs/cqrs';
import { CreateEntityHandler } from './application/commands/create-entity.handler';
import { DrizzleEntityRepository } from './infrastructure/repositories/drizzle-orm/drizzle-orm/drizzle-entity.repository';

@Module({
    controllers: [EntityController],
    providers: [
        CreateEntityHandler,
        {
            provide: 'EntityRepository',     // token que se inyecta en el handler
            useClass: DrizzleEntityRepository, // implementación concreta
        },
    ],
    imports: [CqrsModule],
    // exports: [EntityService]
})
export class EntityModule {}