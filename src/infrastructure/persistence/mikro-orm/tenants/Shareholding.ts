import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Entity } from './Entity';
import { ShareholdingValidity } from './ShareholdingValidity';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class Shareholding {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  entity!: Ref<Entity>;
  shareholerEntity!: Ref<Entity>;
  isActive: boolean & Opt = true;
  ownershipPercentage?: string;
  sharesQuantity?: number;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
  shareholdingValidityCollection = new Collection<ShareholdingValidity>(this);
}

export const ShareholdingSchema = defineEntity({
  class: Shareholding,
  schema: 'tenants',
  uniques: [
    { name: 'shareholding_unique', properties: ['entity', 'shareholerEntity'] },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('shareholding_idx_system_subscription'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').comment('This is the company. Must be legal entity.'),
    shareholerEntity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').comment('This is the shareholder.').index('shareholding_idx_shareholer_entity'),
    isActive: p.boolean(),
    ownershipPercentage: p.decimal().precision(5).scale(2).nullable(),
    sharesQuantity: p.integer().nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
    shareholdingValidityCollection: () => p.oneToMany(ShareholdingValidity).mappedBy('shareholding'),
  },
});
