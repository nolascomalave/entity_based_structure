// domain/repositories/entity.repository.ts
import { Entity } from '../entities/entity.entity';

export interface EntityPort {
    list(): Promise<Entity[]>;
    create(): Promise<Entity>;
    // otros métodos necesarios para el dominio
}