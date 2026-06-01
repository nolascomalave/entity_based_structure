/* import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Entity } from '../../domain/entities/entity.entity';
import { EntityRepository } from '../../domain/repositories/entity.repository';
import { CreateEntityCommand } from './create-entity.command';

@CommandHandler(CreateEntityCommand)
export class CreateEntityHandler implements ICommandHandler<CreateEntityCommand> {
  constructor(
    @Inject('EntityRepository')
    private readonly entityRepository: EntityRepository,
  ) {}

  async execute(command: CreateEntityCommand): Promise<Entity> {
    // Crear value objects (validan automáticamente)
    const nameType = command.nameType ? new NameType(command.nameType) : null;
    const phone = command.phone ? new Phone(command.phone) : null;
    const email = command.email ? new Email(command.email) : null;

    const newEntity = new Entity(
      crypto.randomUUID(),
      command.systemSubscriptionId,
      command.isNatural,
      command.name || null,
      nameType,
      phone,
      null, // phoneVerifiedAt
      email,
      null, // emailVerifiedAt
      new Date(),
      new Date(),
    );

    await this.entityRepository.save(newEntity);
    return newEntity;
  }
} */