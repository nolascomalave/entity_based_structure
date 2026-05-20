import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Branch } from './Branch';
import { Department } from './Department';
import { EmployeePerPosition } from './EmployeePerPosition';
import { Entity } from './Entity';
import { JobFamily } from './JobFamily';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class Position {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  entity?: Ref<Entity>;
  parent?: Ref<Position>;
  jobFamily?: Ref<JobFamily>;
  department?: Ref<Department>;
  name!: string;
  description?: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
  branchCollection = new Collection<Branch>(this);
  employeePerPosition?: Ref<EmployeePerPosition>;
  positionCollection = new Collection<Position>(this);
}

export const PositionSchema = defineEntity({
  class: Position,
  schema: 'tenants',
  uniques: [
    {
      name: 'position_unique',
      properties: ['entity', 'parent', 'jobFamily', 'department', 'name'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('position_idx_system_subscription'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').nullable().comment('Must be null if parent_id fiel is not null. If parent_id field is null, this field must be not null.'),
    parent: () => p.manyToOne(Position).ref().updateRule('no action').deleteRule('no action').nullable().comment('Must be null if entity_id fiel is not null. If entity_id field is null, this field must be not null.').index('position_idx_parent'),
    jobFamily: () => p.manyToOne(JobFamily).ref().updateRule('no action').deleteRule('no action').nullable().index('position_idx_job_family'),
    department: () => p.manyToOne(Department).ref().updateRule('no action').deleteRule('no action').nullable().index('position_idx_department'),
    name: p.string().length(250),
    description: p.text().nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
    branchCollection: () => p.oneToMany(Branch).mappedBy('position'),
    employeePerPosition: () => p.oneToOne(EmployeePerPosition).ref().mappedBy('position'),
    positionCollection: () => p.oneToMany(Position).mappedBy('parent'),
  },
});
