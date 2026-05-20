import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { IdentityDocumentByEntity } from './IdentityDocumentByEntity';
import { IdentityDocumentCategory } from './IdentityDocumentCategory';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class IdentityDocument {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  identityDocumentCategory!: Ref<IdentityDocumentCategory>;
  document!: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  identityDocumentByEntityCollection = new Collection<IdentityDocumentByEntity>(this);
}

export const IdentityDocumentSchema = defineEntity({
  class: IdentityDocument,
  schema: 'tenants',
  uniques: [
    {
      name: 'identity_document_unique',
      properties: ['identityDocumentCategory', 'document'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('identity_document_idx_system_subscription'),
    identityDocumentCategory: () => p.manyToOne(IdentityDocumentCategory).ref().updateRule('no action').deleteRule('no action'),
    document: p.string().length(250),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    identityDocumentByEntityCollection: () => p.oneToMany(IdentityDocumentByEntity).mappedBy('identityDocument'),
  },
});
