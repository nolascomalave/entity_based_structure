import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Branch } from './Branch';
import { EntityAddress } from './EntityAddress';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class EntityAddressByBranch {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  branch!: Ref<Branch>;
  entityAddress!: Ref<EntityAddress>;
  isPreferred: boolean & Opt = false;
  description?: string;
  ordering: number & Opt = 0;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
}

export const EntityAddressByBranchSchema = defineEntity({
  class: EntityAddressByBranch,
  schema: 'tenants',
  uniques: [
    {
      name: 'entity_address_by_branch_unique',
      properties: ['branch', 'entityAddress'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('entity_address_by_branch_idx_system_subscription'),
    branch: () => p.manyToOne(Branch).ref().updateRule('no action').deleteRule('no action'),
    entityAddress: () => p.manyToOne(EntityAddress).ref().updateRule('no action').deleteRule('no action').index('entity_address_by_branch_idx_entity_address'),
    isPreferred: p.boolean(),
    description: p.text().nullable(),
    ordering: p.integer(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
  },
});
