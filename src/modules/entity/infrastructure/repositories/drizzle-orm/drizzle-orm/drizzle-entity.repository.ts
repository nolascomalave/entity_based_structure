// infrastructure/repositories/drizzle-entity.repository.ts
import { Injectable } from '@nestjs/common';
import { entity as entitySchema } from '../../../schemas/drizzle-orm/tenants/entity.schema';
import { EntityPort } from '../../../../domain/ports/entity.port';
import { Entity } from '../../../../domain/entities/entity.entity';
import { DrizzleClientService } from 'src/shared/database/services/drizzle-client.service';

@Injectable()
export class DrizzleEntityRepository implements EntityPort {
  constructor(private readonly drizzleDB: DrizzleClientService) {}

  async create(/* entity: Entity */): Promise<Entity> {
    return new Entity({
      id: "",
      systemSubscriptionId: "",
      fusionMasterEntityId: "",
      isNatural: true,
      identityDocument: "",
      name: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      fusionedAt: new Date(),
      annulledAt: new Date(),
      deletedAt: new Date()
    });
    // return this.drizzleDB.db.insert(entitySchema).values({});
  }

  async list(): Promise<Entity[]> {
    const entities = await this.drizzleDB.db.select().from(entitySchema);
    return entities.map(e => new Entity({
      id: e.id,
      systemSubscriptionId: e.systemSubscriptionId,
      fusionMasterEntityId: e.fusionMasterEntityId,
      isNatural: e.isNatural,
      identityDocument: e.identityDocument,
      name: e.name,
      createdAt: new Date(e.createdAt),
      updatedAt: new Date(e.updatedAt),
      fusionedAt: e.fusionedAt ? new Date(e.fusionedAt) : null,
      annulledAt: e.annulledAt ? new Date(e.annulledAt) : null,
      deletedAt: e.deletedAt ? new Date(e.deletedAt) : null
    }));
  }
}