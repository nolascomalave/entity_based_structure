import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Entity } from './Entity';
import { Phone } from '../osbs/Phone';
import { PhoneByEntityByBranch } from './PhoneByEntityByBranch';
import { RecoveryPasswordNotify } from './RecoveryPasswordNotify';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class PhoneByEntity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  phone!: Ref<Phone>;
  entity!: Ref<Entity>;
  preferred: boolean & Opt = false;
  description?: string;
  ordering: number & Opt = 0;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  phoneByEntityByBranchCollection = new Collection<PhoneByEntityByBranch>(this);
  recoveryPasswordNotifyCollection = new Collection<RecoveryPasswordNotify>(this);
}

export const PhoneByEntitySchema = defineEntity({
  class: PhoneByEntity,
  schema: 'tenants',
  uniques: [{ name: 'phone_by_entity_unique', properties: ['phone', 'entity'] }],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`).index('recovery_password_notify_idx_phone_by_entity'),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('phone_by_entity_idx_system_subscription'),
    phone: () => p.manyToOne(Phone).ref().updateRule('no action').deleteRule('no action'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').index('phone_by_entity_idx_entity'),
    preferred: p.boolean(),
    description: p.text().nullable(),
    ordering: p.integer(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    phoneByEntityByBranchCollection: () => p.oneToMany(PhoneByEntityByBranch).mappedBy('phoneByEntity'),
    recoveryPasswordNotifyCollection: () => p.oneToMany(RecoveryPasswordNotify).mappedBy('phoneByEntity'),
  },
});
