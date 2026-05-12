import { Entity } from "../../../../domain/entities/entity/entity";
import { EntityRepository } from "../ports/entity.repository";
import { UUID } from "../../../../domain/value-objects/uuid";

export interface RegisterEntityInput {
    system_subscription_id: string;
    fusion_master_entity_id?: string;
    is_natural: boolean;
    // identity_document: string;
    name: string;
}

export interface RegisterEntityOutput {
    id: string;
    system_subscription_id: string;
    fusion_master_entity_id?: string;
    is_natural: boolean;
    // identity_document: string;
    name: string;
}

export class RegisterEntityUseCase {
    constructor(private readonly entityRepository: EntityRepository) {}

    async execute(input: RegisterEntityInput): Promise<RegisterEntityOutput> {
        const entity = Entity.create({
            ...input,
            system_subscription_id: new UUID(input.system_subscription_id),
            fusion_master_entity_id: input.fusion_master_entity_id ? new UUID(input.fusion_master_entity_id) : undefined,
        });

        await this.entityRepository.save(entity);

        return {
            id: entity.id.toString(),
            system_subscription_id: entity.system_subscription_id.toString(),
            fusion_master_entity_id: entity.fusion_master_entity_id ? entity.fusion_master_entity_id.toString() : undefined,
            is_natural: entity.is_natural,
            //: entity.//:,
            name: entity.name,
        }
    }
}