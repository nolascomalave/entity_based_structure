import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { SystemSubscription } from '../osbs/SystemSubscription';
import { AuditLog } from './AuditLog';
import { UserAccess } from './UserAccess';

export class Session {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  userAccess?: Ref<UserAccess>;
  refreshtoken!: string;
  createdAt!: Date & Opt;
  expiresAt!: Date & Opt;
  deletedAt?: Date;
  auditLogCollection = new Collection<AuditLog>(this);
}

export const SessionSchema = defineEntity({
  class: Session,
  schema: 'tenants',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('session_idx_system_subscription'),
    userAccess: () => p.manyToOne(UserAccess).ref().updateRule('no action').deleteRule('no action').nullable().index('session_idx_user_access'),
    refreshtoken: p.text(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    expiresAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
    auditLogCollection: () => p.oneToMany(AuditLog).mappedBy('session'),
  },
});
