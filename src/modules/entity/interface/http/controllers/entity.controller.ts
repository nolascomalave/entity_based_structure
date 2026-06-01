import { Controller, Get, HttpCode, HttpStatus, Post, Response } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateEntityCommand } from 'src/modules/entity/application/commands/create-entity.command';

@Controller('entity')
export class EntityController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get()
  getHello(): string {
    return "Hello, Nolasco!";
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
