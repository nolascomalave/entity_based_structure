import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { RecoveryPasswordNotify } from './RecoveryPasswordNotify';
import { SystemSubscription } from '../osbs/SystemSubscription';
import { UserAccess } from './UserAccess';

export class RecoveryPassword {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  userAccess?: Ref<UserAccess>;
  validityCode!: string;
  createdAt!: Date & Opt;
  expiresAt!: Date & Opt;
  usedAt?: Date;
  deletedAt?: Date;
  recoveryPasswordNotifyCollection = new Collection<RecoveryPasswordNotify>(this);
}

export const RecoveryPasswordSchema = defineEntity({
  class: RecoveryPassword,
  schema: 'tenants',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('recovery_password_idx_system_subscription'),
    userAccess: () => p.manyToOne(UserAccess).ref().updateRule('no action').deleteRule('no action').nullable().index('recovery_password_idx_user_access'),
    validityCode: p.string().length(10),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    expiresAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    usedAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    recoveryPasswordNotifyCollection: () => p.oneToMany(RecoveryPasswordNotify).mappedBy('recoveryPassword'),
  },
});
