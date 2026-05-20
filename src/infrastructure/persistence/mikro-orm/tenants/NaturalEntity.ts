import { type Opt, PrimaryKeyProp, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Entity } from './Entity';
import { NaturalEntityGender } from './NaturalEntityGender';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class NaturalEntity {
  [PrimaryKeyProp]?: 'entity';
  entity!: Ref<Entity>;
  systemSubscription!: Ref<SystemSubscription>;
  naturalEntityGender!: Ref<NaturalEntityGender>;
  birthDate?: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
}

export const NaturalEntitySchema = defineEntity({
  class: NaturalEntity,
  schema: 'tenants',
  properties: {
    entity: () => p.oneToOne(Entity).primary().ref().updateRule('no action').deleteRule('no action'),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('natural_entity_idx_system_subscription'),
    naturalEntityGender: () => p.manyToOne(NaturalEntityGender).ref().updateRule('no action').deleteRule('no action').index('natural_entity_idx_natural_entity_gender'),
    birthDate: p.date().nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
  },
});
