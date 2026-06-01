// domain/repositories/entity.repository.ts
import { Entity } from '../entities/entity.entity';

export interface EntityRepository {
    create(): Promise<Entity>;
    // otros métodos necesarios para el dominio
}