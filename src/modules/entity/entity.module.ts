import { Module } from '@nestjs/common';
import { EntityController } from './interface/http/controllers/entity.controller';
import { /* CommandBus, */ CqrsModule } from '@nestjs/cqrs';
import { CreateEntityHandler } from './application/commands/create-entity.handler';
import { DrizzleEntityRepository } from './infrastructure/repositories/drizzle-orm/drizzle-orm/drizzle-entity.repository';
import { ListEntityHandler } from './application/queries/list-entity.handler';

@Module({
    controllers: [EntityController],
    providers: [
        CreateEntityHandler,
        ListEntityHandler,
        {
            provide: 'EntityPort',     // token que se inyecta en el handler
            useClass: DrizzleEntityRepository, // implementación concreta
        },
    ],
    imports: [CqrsModule],
    // exports: [EntityService]
})
export class EntityModule {}