export abstract class DomainError extends Error {
    constructor(
        mensaje: string,
        public readonly code: string | number,
        public readonly details?: any
    ) {
        super(mensaje);

        Error.captureStackTrace(this, this.constructor);
    }
}