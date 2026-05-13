import { DomainError } from "./domain-error.base";

export class InvalidValueError extends DomainError {
    constructor(valueObjectName: string, invalidValue: unknown) {
        super(
            `${valueObjectName} recibió un valor inválido: ${String(invalidValue)}`,
            'INVALID_VALUE',
            { valueObjectName, invalidValue }
        );
    }
}