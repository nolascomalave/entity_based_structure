import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { SystemSubscription } from '../osbs/SystemSubscription';
import { UserAccess } from './UserAccess';

export class UserAccessValidity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  userAccess!: Ref<UserAccess>;
  startDate!: Date & Opt;
  endDate?: Date;
}

export const UserAccessValiditySchema = defineEntity({
  class: UserAccessValidity,
  schema: 'tenants',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('user_access_validity_idx_system_subscription'),
    userAccess: () => p.manyToOne(UserAccess).ref().updateRule('no action').deleteRule('no action').index('user_access_validity_idx_user_access'),
    startDate: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    endDate: p.datetime().nullable(),
  },
});
