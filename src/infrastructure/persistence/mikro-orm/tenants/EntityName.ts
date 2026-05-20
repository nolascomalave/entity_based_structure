import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { EntityNameByEntity } from './EntityNameByEntity';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class EntityName {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  name!: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  entityNameByEntityCollection = new Collection<EntityNameByEntity>(this);
}

export const EntityNameSchema = defineEntity({
  class: EntityName,
  schema: 'tenants',
  uniques: [
    { name: 'entity_name_unique', properties: ['systemSubscription', 'name'] },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action'),
    name: p.string().length(250),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    entityNameByEntityCollection: () => p.oneToMany(EntityNameByEntity).mappedBy('entityName'),
  },
});
