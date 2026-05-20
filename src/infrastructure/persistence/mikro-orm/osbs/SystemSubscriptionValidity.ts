import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { SystemSubscription } from './SystemSubscription';

export class SystemSubscriptionValidity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  startDate!: Date;
  endDate?: Date;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
}

export const SystemSubscriptionValiditySchema = defineEntity({
  class: SystemSubscriptionValidity,
  schema: 'osbs',
  indexes: [
    {
      name: 'system_subscription_validity_uq_no_overlap',
      expression: 'CREATE INDEX system_subscription_validity_uq_no_overlap ON osbs.system_subscription_validity USING gist (system_subscription_id, tstzrange(start_date, end_date, \'[)\'::text))',
      type: 'gist',
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('system_subscription_validity_idx_system_subscription'),
    startDate: p.datetime(),
    endDate: p.datetime().nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
  },
});
