import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { EmailByEntity } from './EmailByEntity';
import { RecoveryPassword } from './RecoveryPassword';
import { Session } from './Session';
import { SystemSubscription } from '../osbs/SystemSubscription';
import { SystemSubscriptionClient } from './SystemSubscriptionClient';
import { AuditLog } from './AuditLog';
import { UserAccessValidity } from './UserAccessValidity';

export class UserAccess {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  systemSubscriptionClient!: Ref<SystemSubscriptionClient>;
  emailByEntity!: Ref<EmailByEntity>;
  password!: string;
  isActive: boolean & Opt = true;
  auditLogCollection = new Collection<AuditLog>(this);
  recoveryPasswordCollection = new Collection<RecoveryPassword>(this);
  sessionCollection = new Collection<Session>(this);
  userAccessValidityCollection = new Collection<UserAccessValidity>(this);
}

export const UserAccessSchema = defineEntity({
  class: UserAccess,
  schema: 'tenants',
  uniques: [
    {
      name: 'user_access_unique',
      properties: ['systemSubscriptionClient', 'emailByEntity'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('user_access_idx_system_subscription'),
    systemSubscriptionClient: () => p.manyToOne(SystemSubscriptionClient).ref().updateRule('no action').deleteRule('no action'),
    emailByEntity: () => p.manyToOne(EmailByEntity).ref().updateRule('no action').deleteRule('no action').index('user_access_idx_email_by_entity'),
    password: p.text(),
    isActive: p.boolean(),
    auditLogCollection: () => p.oneToMany(AuditLog).mappedBy('userAccess'),
    recoveryPasswordCollection: () => p.oneToMany(RecoveryPassword).mappedBy('userAccess'),
    sessionCollection: () => p.oneToMany(Session).mappedBy('userAccess'),
    userAccessValidityCollection: () => p.oneToMany(UserAccessValidity).mappedBy('userAccess'),
  },
});
