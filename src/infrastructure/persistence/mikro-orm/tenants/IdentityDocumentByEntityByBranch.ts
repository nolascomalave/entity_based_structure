import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Branch } from './Branch';
import { IdentityDocumentByEntity } from './IdentityDocumentByEntity';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class IdentityDocumentByEntityByBranch {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  branch!: Ref<Branch>;
  identityDocumentByEntity!: Ref<IdentityDocumentByEntity>;
  description?: string;
  ordering: number & Opt = 0;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
}

export const IdentityDocumentByEntityByBranchSchema = defineEntity({
  class: IdentityDocumentByEntityByBranch,
  schema: 'tenants',
  uniques: [
    {
      name: 'identity_document_by_entity_by_branch_unique',
      properties: ['branch', 'identityDocumentByEntity'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('identity_document_by_entity_by_branch_idx_system_subscription'),
    branch: () => p.manyToOne(Branch).ref().updateRule('no action').deleteRule('no action'),
    identityDocumentByEntity: () => p.manyToOne(IdentityDocumentByEntity).ref().updateRule('no action').deleteRule('no action').index('identity_document_by_entity_by_branch_idx_ident_doc_by_ent'),
    description: p.text().nullable(),
    ordering: p.integer(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
  },
});
