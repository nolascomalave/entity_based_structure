import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class AttachedDocuments {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  originTable!: string;
  originId!: string;
  originalName!: string;
  documentName!: string;
  extension!: string;
  mimeType!: string;
  bytesSize!: string;
  storageRoute!: string;
  disk?: string = 'local';
  documentHash?: string;
  description?: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
}

export const AttachedDocumentsSchema = defineEntity({
  class: AttachedDocuments,
  schema: 'tenants',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('attached_documents_idx_system_subscription'),
    originTable: p.string().length(250).index('attached_documents_idx_origin_table'),
    originId: p.uuid().index('attached_documents_idx_origin'),
    originalName: p.string().length(250),
    documentName: p.string().length(250).unique('attached_documents_uq_idx_document_name'),
    extension: p.string().length(20),
    mimeType: p.string().length(100),
    bytesSize: p.uuid(),
    storageRoute: p.string().length(2500),
    disk: p.string().length(50).nullable(),
    documentHash: p.string().length(64).nullable(),
    description: p.text().nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
  },
});
