import { Collection, type Opt, defineEntity, p } from '@mikro-orm/core';
import { SystemSubscriptionClient } from '../tenants/SystemSubscriptionClient';

export class SystemClient {
  id!: string & Opt;
  name!: string;
  description?: string;
  isActive: boolean & Opt = true;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  systemSubscriptionClientCollection = new Collection<SystemSubscriptionClient>(this);
}

export const SystemClientSchema = defineEntity({
  class: SystemClient,
  schema: 'osbs',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    name: p.string().length(250).unique('system_client_uq_idx_name'),
    description: p.text().nullable(),
    isActive: p.boolean(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    systemSubscriptionClientCollection: () => p.oneToMany(SystemSubscriptionClient).mappedBy('systemClient'),
  },
});
