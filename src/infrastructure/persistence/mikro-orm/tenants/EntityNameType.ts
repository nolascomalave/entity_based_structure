import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { EntityNameByEntity } from './EntityNameByEntity';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class EntityNameType {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  type!: string;
  applyToNatural: boolean & Opt = true;
  applyToLegal: boolean & Opt = true;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  entityNameByEntityCollection = new Collection<EntityNameByEntity>(this);
}

export const EntityNameTypeSchema = defineEntity({
  class: EntityNameType,
  schema: 'tenants',
  uniques: [
    {
      name: 'entity_name_type_unique',
      properties: ['systemSubscription', 'type'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action'),
    type: p.string().length(50),
    applyToNatural: p.boolean(),
    applyToLegal: p.boolean(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    entityNameByEntityCollection: () => p.oneToMany(EntityNameByEntity).mappedBy('entityNameType'),
  },
});
