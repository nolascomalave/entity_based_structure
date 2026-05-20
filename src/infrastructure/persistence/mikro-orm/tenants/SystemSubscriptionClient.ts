import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { SystemClient } from '../osbs/SystemClient';
import { SystemSubscription } from '../osbs/SystemSubscription';
import { UserAccess } from './UserAccess';

export class SystemSubscriptionClient {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  systemClient?: Ref<SystemClient>;
  name!: string;
  description?: string;
  isActive: boolean & Opt = true;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  userAccessCollection = new Collection<UserAccess>(this);
}

export const SystemSubscriptionClientSchema = defineEntity({
  class: SystemSubscriptionClient,
  schema: 'tenants',
  uniques: [
    {
      name: 'system_subscription_client_unique',
      properties: ['systemSubscription', 'name'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action'),
    systemClient: () => p.manyToOne(SystemClient).ref().updateRule('no action').deleteRule('no action').nullable().comment('Can be null if is not a official system client for this backend system.').index('system_subscription_client_idx_system_client'),
    name: p.string().length(250),
    description: p.text().nullable(),
    isActive: p.boolean(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    userAccessCollection: () => p.oneToMany(UserAccess).mappedBy('systemSubscriptionClient'),
  },
});
