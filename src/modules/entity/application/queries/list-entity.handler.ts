// application/queries/get-entities.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListEntityQuery } from './list-entity.query';
import { EntityPort } from '../../domain/ports/entity.port';
import { Entity } from '../../domain/entities/entity.entity';

@QueryHandler(ListEntityQuery)
export class ListEntityHandler implements IQueryHandler<ListEntityQuery> {
  constructor(
    @Inject('EntityPort')
    private readonly entityRepository: EntityPort,
  ) {}

  async execute(query: ListEntityQuery): Promise<Entity[]> {
    // Puedes pasar los parámetros de paginación si el repositorio lo soporta
    return this.entityRepository.list();
  }
}