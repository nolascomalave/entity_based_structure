import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Branch } from './Branch';
import { EmailByEntity } from './EmailByEntity';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class EmailByEntityByBranch {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  branch!: Ref<Branch>;
  emailByEntity!: Ref<EmailByEntity>;
  description?: string;
  ordering: number & Opt = 0;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
}

export const EmailByEntityByBranchSchema = defineEntity({
  class: EmailByEntityByBranch,
  schema: 'tenants',
  uniques: [
    {
      name: 'email_by_entity_by_branch_unique',
      properties: ['branch', 'emailByEntity'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('email_by_entity_by_branch_idx_system_subscription'),
    branch: () => p.manyToOne(Branch).ref().updateRule('no action').deleteRule('no action'),
    emailByEntity: () => p.manyToOne(EmailByEntity).ref().updateRule('no action').deleteRule('no action').index('email_by_entity_by_branch_idx_email_by_entity'),
    description: p.text().nullable(),
    ordering: p.integer(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
  },
});
