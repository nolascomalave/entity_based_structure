type CreateSystemSubscriptionCommandProps = {
    systemSubscriptionId
    isNatural
    name
    nameType
    phone
    email
}

export class CreateSystemSubscriptionCommand {
    constructor(
        public readonly systemSubscriptionId: string,
        public readonly isNatural: boolean,
        public readonly name?: string,
        public readonly nameType?: string,   // 'main', 'commercial', etc.
        public readonly phone?: string,
        public readonly email?: string,
    ) {}
}