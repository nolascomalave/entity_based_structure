import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { NaturalEntity } from './NaturalEntity';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class NaturalEntityGender {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  gender!: string;
  description?: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  naturalEntityCollection = new Collection<NaturalEntity>(this);
}

export const NaturalEntityGenderSchema = defineEntity({
  class: NaturalEntityGender,
  schema: 'tenants',
  uniques: [
    {
      name: 'natural_entity_gender_unique',
      properties: ['systemSubscription', 'gender'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action'),
    gender: p.string().length(100),
    description: p.string().length(2500).nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    naturalEntityCollection: () => p.oneToMany(NaturalEntity).mappedBy('naturalEntityGender'),
  },
});
