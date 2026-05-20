import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Shareholding } from './Shareholding';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class ShareholdingValidity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  shareholding!: Ref<Shareholding>;
  startDate!: Date;
  endDate?: Date;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
}

export const ShareholdingValiditySchema = defineEntity({
  class: ShareholdingValidity,
  schema: 'tenants',
  indexes: [
    {
      name: 'shareholding_validity_uq_no_overlap',
      expression: 'CREATE INDEX shareholding_validity_uq_no_overlap ON tenants.shareholding_validity USING gist (shareholding_id, tstzrange(start_date, end_date, \'[)\'::text))',
      type: 'gist',
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('shareholding_validity_idx_system_subscription'),
    shareholding: () => p.manyToOne(Shareholding).ref().updateRule('no action').deleteRule('no action').index('shareholding_validity_idx_shareholding'),
    startDate: p.datetime(),
    endDate: p.datetime().nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
  },
});
