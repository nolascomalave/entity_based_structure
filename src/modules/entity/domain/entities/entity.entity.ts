type EntityProps = {
    id: string;
    systemSubscriptionId: string;
    fusionMasterEntityId: string | null;
    isNatural: boolean;
    identityDocument: string | null;
    name: string | null;
    createdAt: Date;
    updatedAt: Date;
    fusionedAt: Date | null;
    annulledAt: Date | null;
    deletedAt: Date | null;
}

export class Entity {
    public readonly id: EntityProps["id"];
    public readonly systemSubscriptionId: EntityProps["systemSubscriptionId"];
    public readonly fusionMasterEntityId: EntityProps["fusionMasterEntityId"];
    public readonly isNatural: EntityProps["isNatural"];
    public readonly identityDocument: EntityProps["identityDocument"];
    public readonly name: EntityProps["name"];
    public readonly createdAt: EntityProps["createdAt"];
    public readonly updatedAt: EntityProps["updatedAt"];
    public readonly fusionedAt: EntityProps["fusionedAt"];
    public readonly annulledAt: EntityProps["annulledAt"];
    public readonly deletedAt: EntityProps["deletedAt"];

    constructor(props: EntityProps) {
        this.id = props.id;
        this.systemSubscriptionId = props.systemSubscriptionId;
        this.fusionMasterEntityId = props.fusionMasterEntityId;
        this.isNatural = props.isNatural;
        this.identityDocument = props.identityDocument;
        this.name = props.name;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.fusionedAt = props.fusionedAt;
        this.annulledAt = props.annulledAt;
        this.deletedAt = props.deletedAt;
    }

    /* // Puedes añadir métodos de dominio aquí
    public isNaturalPerson(): boolean {
        return this.isNatural;
    }

    public isLegalEntity(): boolean {
        return !this.isNatural;
    } */
}