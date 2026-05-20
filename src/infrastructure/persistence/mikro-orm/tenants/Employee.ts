import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { EmployeePerPosition } from './EmployeePerPosition';
import { EmployeeValidity } from './EmployeeValidity';
import { Entity } from './Entity';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class Employee {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  personEntity!: Ref<Entity>;
  legalEntity!: Ref<Entity>;
  employeeCode!: string;
  isActive: boolean & Opt = true;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
  employeePerPositionCollection = new Collection<EmployeePerPosition>(this);
  employeeValidityCollection = new Collection<EmployeeValidity>(this);
}

export const EmployeeSchema = defineEntity({
  class: Employee,
  schema: 'tenants',
  uniques: [
    { name: 'employee_unique_code', properties: ['legalEntity', 'employeeCode'] },
    {
      name: 'employee_unique_person',
      properties: ['personEntity', 'legalEntity'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('employee_idx_system_subscription'),
    personEntity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').comment('The entity must be natural.'),
    legalEntity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').comment('Company where the employee work. This entity_id must point at legal entity.'),
    employeeCode: p.string().length(100),
    isActive: p.boolean(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
    employeePerPositionCollection: () => p.oneToMany(EmployeePerPosition).mappedBy('employee'),
    employeeValidityCollection: () => p.oneToMany(EmployeeValidity).mappedBy('employee'),
  },
});
