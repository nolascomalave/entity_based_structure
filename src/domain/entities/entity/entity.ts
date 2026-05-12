import { UUID } from "../../value-objects/uuid";

export interface EntityProps {
    // id: UUID;
    system_subscription_id: UUID;
    fusion_master_entity_id?: UUID;
    is_natural: boolean;
    // identity_document: string;
    name: string;
}

export class Entity implements EntityProps {
    public readonly id: UUID;
    public readonly system_subscription_id: UUID;
    public readonly fusion_master_entity_id: UUID;
    public readonly is_natural: boolean;
    // public readonly identity_document: string,
    public readonly name: string;

    constructor(props: EntityProps) {
        this.id = new UUID(crypto.randomUUID());
        this.system_subscription_id = props.system_subscription_id;
        this.fusion_master_entity_id = props.fusion_master_entity_id ?? undefined;
        this.is_natural = props.is_natural;
        this.name = props.name;
    }

    public static create(props: EntityProps): Entity {
        if(props.name.trim().length < 1) {
            throw new Error('The name of this entity is required.');
        }

        return new Entity(props);
    }
}