// infrastructure/repositories/drizzle-entity.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/postgres-js';
import { entity as entitySchema } from '../../../schemas/drizzle-orm/tenants/entity.schema';
import { EntityRepository } from '../../../../domain/repositories/entity.repository';
import { Entity } from '../../../../domain/entities/entity.entity';
import { DrizzleClientService } from 'src/shared/database/services/drizzle-client.service';

@Injectable()
export class DrizzleEntityRepository implements EntityRepository {
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
}