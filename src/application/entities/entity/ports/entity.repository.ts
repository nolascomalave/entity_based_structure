import { Entity } from "src/domain/entities/entity/entity"

export interface EntityRepository {
    save(entity: Entity): Promise<Entity>;
    findById(id: string): Promise<Entity | null>
}