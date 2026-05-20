import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Branch } from './Branch';
import { Entity } from './Entity';
import { SubsidiaryValidity } from './SubsidiaryValidity';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class Subsidiary {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  entity!: Ref<Entity>;
  parentEntity!: Ref<Entity>;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  branchCollection = new Collection<Branch>(this);
  subsidiaryValidityCollection = new Collection<SubsidiaryValidity>(this);
}

export const SubsidiarySchema = defineEntity({
  class: Subsidiary,
  schema: 'tenants',
  uniques: [{ name: 'subsidiary_unique', properties: ['entity', 'parentEntity'] }],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('subsidiary_idx_system_subscription'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action'),
    parentEntity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').index('subsidiary_idx_parent_entity'),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    branchCollection: () => p.oneToMany(Branch).mappedBy('subsidiary'),
    subsidiaryValidityCollection: () => p.oneToMany(SubsidiaryValidity).mappedBy('subsidiary'),
  },
});
