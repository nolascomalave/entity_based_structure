import { DomainError } from './domain-error.base';

export class EntityValidationError extends DomainError {
  constructor(code: string, message: string, metadata?: Record<string, unknown>) {
    super(message, code, metadata);
  }
}