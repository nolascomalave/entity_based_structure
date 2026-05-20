import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Session } from './Session';
import { SystemSubscription } from '../osbs/SystemSubscription';
import { UserAccess } from './UserAccess';

export class AuditLog {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  userAccess?: Ref<UserAccess>;
  session?: Ref<Session>;
  recordId!: string;
  tableName!: string;
  action!: string;
  oldData?: any;
  newData!: any;
  changedAt!: Date & Opt;
}

export const AuditLogSchema = defineEntity({
  class: AuditLog,
  tableName: 'audit_log',
  schema: 'tenants',
  indexes: [
    { name: 'audit_log_idx_table_record', properties: ['tableName', 'recordId'] },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('audit_log_idx_system_subscription'),
    userAccess: () => p.manyToOne(UserAccess).ref().updateRule('no action').deleteRule('no action').nullable().index('audit_log_idx_user_access'),
    session: () => p.manyToOne(Session).ref().updateRule('no action').nullable().index('audit_log_idx_session'),
    recordId: p.uuid().index('audit_log_idx_record'),
    tableName: p.string().length(100),
    action: p.string().length(10),
    oldData: p.json().nullable(),
    newData: p.json(),
    changedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
  },
});
