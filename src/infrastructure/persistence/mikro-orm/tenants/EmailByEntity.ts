import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Email } from '../osbs/Email';
import { EmailByEntityByBranch } from './EmailByEntityByBranch';
import { Entity } from './Entity';
import { RecoveryPasswordNotify } from './RecoveryPasswordNotify';
import { SystemSubscription } from '../osbs/SystemSubscription';
import { UserAccess } from './UserAccess';

export class EmailByEntity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  email!: Ref<Email>;
  entity!: Ref<Entity>;
  preferred: boolean & Opt = false;
  description?: string;
  ordering: number & Opt = 0;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  emailByEntityByBranchCollection = new Collection<EmailByEntityByBranch>(this);
  recoveryPasswordNotifyCollection = new Collection<RecoveryPasswordNotify>(this);
  userAccessCollection = new Collection<UserAccess>(this);
}

export const EmailByEntitySchema = defineEntity({
  class: EmailByEntity,
  schema: 'tenants',
  uniques: [{ name: 'email_by_entity_unique', properties: ['email', 'entity'] }],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`).index('recovery_password_notify_idx_email_by_entity'),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('email_by_entity_idx_system_subscription'),
    email: () => p.manyToOne(Email).ref().updateRule('no action').deleteRule('no action'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').index('email_by_entity_idx_entity'),
    preferred: p.boolean(),
    description: p.text().nullable(),
    ordering: p.integer(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    emailByEntityByBranchCollection: () => p.oneToMany(EmailByEntityByBranch).mappedBy('emailByEntity'),
    recoveryPasswordNotifyCollection: () => p.oneToMany(RecoveryPasswordNotify).mappedBy('emailByEntity'),
    userAccessCollection: () => p.oneToMany(UserAccess).mappedBy('emailByEntity'),
  },
});
