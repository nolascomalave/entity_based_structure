import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Entity } from './Entity';
import { EntityName } from './EntityName';
import { EntityNameType } from './EntityNameType';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class EntityNameByEntity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  entity!: Ref<Entity>;
  entityName!: Ref<EntityName>;
  entityNameType!: Ref<EntityNameType>;
  orderingByType: number & Opt = 0;
  description?: string;
  ordering: number & Opt = 0;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
}

export const EntityNameByEntitySchema = defineEntity({
  class: EntityNameByEntity,
  schema: 'tenants',
  uniques: [
    {
      name: 'entity_name_by_entity_unique',
      properties: ['entity', 'entityName', 'entityNameType'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('entity_name_by_entity_idx_system_subscription'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action'),
    entityName: () => p.manyToOne(EntityName).ref().updateRule('no action').deleteRule('no action').index('entity_name_by_entity_idx_entity_name'),
    entityNameType: () => p.manyToOne(EntityNameType).ref().updateRule('no action').deleteRule('no action').index('entity_name_by_entity_idx_entity_name_type'),
    orderingByType: p.integer(),
    description: p.text().nullable(),
    ordering: p.integer(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
  },
});
