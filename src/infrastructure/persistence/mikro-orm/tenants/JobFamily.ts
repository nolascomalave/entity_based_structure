import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Entity } from './Entity';
import { Position } from './Position';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class JobFamily {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  entity!: Ref<Entity>;
  name!: string;
  description?: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
  positionCollection = new Collection<Position>(this);
}

export const JobFamilySchema = defineEntity({
  class: JobFamily,
  schema: 'tenants',
  uniques: [{ name: 'job_family_unique', properties: ['entity', 'name'] }],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('job_family_idx_system_subscription'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action'),
    name: p.string().length(250),
    description: p.text().nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
    positionCollection: () => p.oneToMany(Position).mappedBy('jobFamily'),
  },
});
