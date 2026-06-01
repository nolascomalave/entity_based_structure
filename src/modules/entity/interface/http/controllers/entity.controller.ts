import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateEntityCommand } from 'src/modules/entity/application/commands/create-entity.command';
import { ListEntityQuery } from 'src/modules/entity/application/queries/list-entity.query';
import { Entity } from 'src/modules/entity/domain/entities/entity.entity';

@Controller('entity')
export class EntityController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  async list(): Promise<Entity> {
    return await this.queryBus.execute(new ListEntityQuery());
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create() {
    return await this.commandBus.execute(new CreateEntityCommand({
      isNatural: true,
      name: [],
      phone: [],
      email: [],
    }));
  }
}
