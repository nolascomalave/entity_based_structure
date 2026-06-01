import { UUID } from "../../../../shared/domain/value-objects/uuid.vo";

type NameProps = UUID | (({ type: string; } | { entityNameTypeId: UUID; }) & { value: string; });

type PhoneProps = UUID | {
    countryId: UUID;
    stateId?: UUID;
    phone: string;
    preferred?: boolean;
    description?: string;
};

type EmailProps = UUID | {
    phone: string;
    preferred?: boolean;
    description?: string;
};

type CreateOrUpdateEntityCommandProps = {
    isNatural: boolean;
    name?: NameProps | NameProps[];
    phone?: PhoneProps | PhoneProps[];
    email?: EmailProps | EmailProps[];
} & ({ id: UUID; } | { systemSubscriptionId?: UUID; });

export class CreateEntityCommand {
    public readonly id?: UUID;
    public readonly systemSubscriptionId?: UUID;
    public readonly isNatural: CreateOrUpdateEntityCommandProps["isNatural"];
    public readonly name?: CreateOrUpdateEntityCommandProps["name"];
    public readonly phone?: CreateOrUpdateEntityCommandProps["phone"];
    public readonly email?: CreateOrUpdateEntityCommandProps["email"];

    constructor(props: CreateOrUpdateEntityCommandProps) {
        if("id" in props) {
            this.id = props.id;
        }

        if("systemSubscriptionId" in props) {
            this.systemSubscriptionId = props.systemSubscriptionId;
        }

        this.isNatural = props.isNatural;
        this.name = props.name;
        this.phone = props.phone;
        this.email = props.email;
    }
}