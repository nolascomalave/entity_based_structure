import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { EmailByEntity } from './EmailByEntity';
import { PhoneByEntity } from './PhoneByEntity';
import { RecoveryPassword } from './RecoveryPassword';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class RecoveryPasswordNotify {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  recoveryPassword!: Ref<RecoveryPassword>;
  phoneByEntity?: Ref<PhoneByEntity>;
  emailByEntity?: Ref<EmailByEntity>;
  createdAt!: Date & Opt;
  deletedAt?: Date;
}

export const RecoveryPasswordNotifySchema = defineEntity({
  class: RecoveryPasswordNotify,
  schema: 'tenants',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('recovery_password_notify_idx_system_subscription'),
    recoveryPassword: () => p.manyToOne(RecoveryPassword).ref().updateRule('no action').deleteRule('no action').index('recovery_password_notify_idx_recovery_password'),
    phoneByEntity: () => p.manyToOne(PhoneByEntity).ref().updateRule('no action').deleteRule('no action').nullable(),
    emailByEntity: () => p.manyToOne(EmailByEntity).ref().updateRule('no action').deleteRule('no action').nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
  },
});
