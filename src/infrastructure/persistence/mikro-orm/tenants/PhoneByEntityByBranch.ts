import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Branch } from './Branch';
import { PhoneByEntity } from './PhoneByEntity';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class PhoneByEntityByBranch {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  branch!: Ref<Branch>;
  phoneByEntity!: Ref<PhoneByEntity>;
  description?: string;
  ordering: number & Opt = 0;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
}

export const PhoneByEntityByBranchSchema = defineEntity({
  class: PhoneByEntityByBranch,
  schema: 'tenants',
  uniques: [
    {
      name: 'phone_by_entity_by_branch_unique',
      properties: ['branch', 'phoneByEntity'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('phone_by_entity_by_branch_idx_system_subscription'),
    branch: () => p.manyToOne(Branch).ref().updateRule('no action').deleteRule('no action'),
    phoneByEntity: () => p.manyToOne(PhoneByEntity).ref().updateRule('no action').deleteRule('no action').index('phone_by_entity_by_branch_idx_phone_by_entity'),
    description: p.text().nullable(),
    ordering: p.integer(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
  },
});
