type SystemSubscriptionProps = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export class Entity {
    public readonly id: SystemSubscriptionProps["id"];
    public readonly createdAt: SystemSubscriptionProps["createdAt"];
    public readonly updatedAt: SystemSubscriptionProps["updatedAt"];
    public readonly deletedAt: SystemSubscriptionProps["deletedAt"];

    constructor(props: SystemSubscriptionProps) {
        this.id = props.id;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.deletedAt = props.deletedAt;
    }
}