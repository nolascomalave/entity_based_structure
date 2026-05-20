import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Subsidiary } from './Subsidiary';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class SubsidiaryValidity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  subsidiary!: Ref<Subsidiary>;
  startDate!: Date;
  endDate?: Date;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
}

export const SubsidiaryValiditySchema = defineEntity({
  class: SubsidiaryValidity,
  schema: 'tenants',
  indexes: [
    {
      name: 'subsidiary_validity_uq_no_overlap',
      expression: 'CREATE INDEX subsidiary_validity_uq_no_overlap ON tenants.subsidiary_validity USING gist (subsidiary_id, tstzrange(start_date, end_date, \'[)\'::text))',
      type: 'gist',
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('subsidiary_validity_idx_system_subscription'),
    subsidiary: () => p.manyToOne(Subsidiary).ref().updateRule('no action').deleteRule('no action').index('subsidiary_validity_idx_subsidiary'),
    startDate: p.datetime(),
    endDate: p.datetime().nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
  },
});
