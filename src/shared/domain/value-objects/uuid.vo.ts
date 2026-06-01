// import { InvalidValueError } from "../errors/invalid-value.error";

export class UUID {
    constructor(public readonly value: string) {
        if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){2}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
            // throw new InvalidValueError('UUID', value);
            throw new Error(`Invalid UUID value: ${value}`);
        }
    }

    toString(): string {
        return this.value;
    }
}