import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Entity } from './Entity';
import { Position } from './Position';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class Department {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  entity?: Ref<Entity>;
  parent?: Ref<Department>;
  name!: string;
  description?: string;
  code?: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
  departmentCollection = new Collection<Department>(this);
  positionCollection = new Collection<Position>(this);
}

export const DepartmentSchema = defineEntity({
  class: Department,
  schema: 'tenants',
  uniques: [
    { name: 'department_unique', properties: ['entity', 'parent', 'name'] },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('department_idx_system_subscription'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').nullable().comment('Must be null if parent_id fiel is not null. If parent_id field is null, this field must be not null.'),
    parent: () => p.manyToOne(Department).ref().updateRule('no action').deleteRule('no action').nullable().comment('Must be null if entity_id fiel is not null. If entity_id field is null, this field must be not null.').index('department_idx_parent'),
    name: p.string().length(250),
    description: p.text().nullable(),
    code: p.string().length(50).nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
    departmentCollection: () => p.oneToMany(Department).mappedBy('parent'),
    positionCollection: () => p.oneToMany(Position).mappedBy('department'),
  },
});
