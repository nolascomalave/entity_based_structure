import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Entity } from './Entity';
import { IdentityDocument } from './IdentityDocument';
import { IdentityDocumentByEntityByBranch } from './IdentityDocumentByEntityByBranch';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class IdentityDocumentByEntity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  entity!: Ref<Entity>;
  identityDocument!: Ref<IdentityDocument>;
  description?: string;
  ordering!: bigint & Opt;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  identityDocumentByEntityByBranchCollection = new Collection<IdentityDocumentByEntityByBranch>(this);
}

export const IdentityDocumentByEntitySchema = defineEntity({
  class: IdentityDocumentByEntity,
  schema: 'tenants',
  uniques: [
    {
      name: 'identity_document_by_entity_unique',
      properties: ['entity', 'identityDocument'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('identity_document_by_entity_idx_system_subscription'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action'),
    identityDocument: () => p.manyToOne(IdentityDocument).ref().updateRule('no action').deleteRule('no action').index('identity_document_by_entity_idx_identity_document'),
    description: p.text().nullable(),
    ordering: p.bigint().defaultRaw(`0`),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    identityDocumentByEntityByBranchCollection: () => p.oneToMany(IdentityDocumentByEntityByBranch).mappedBy('identityDocumentByEntity'),
  },
});
