export class UUID {
    constructor(public readonly value: string) {
        if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){2}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
            throw new Error('UUID inválido');
        }
    }

    toString(): string {
        return this.value;
    }
  }