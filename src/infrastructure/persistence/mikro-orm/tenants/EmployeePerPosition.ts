import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Employee } from './Employee';
import { EmployeePerPositionValidity } from './EmployeePerPositionValidity';
import { Position } from './Position';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class EmployeePerPosition {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  employee!: Ref<Employee>;
  position!: Ref<Position>;
  isActive: boolean & Opt = true;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  employeePerPositionValidityCollection = new Collection<EmployeePerPositionValidity>(this);
}

export const EmployeePerPositionSchema = defineEntity({
  class: EmployeePerPosition,
  schema: 'tenants',
  uniques: [
    { name: 'employee_per_position_unique', properties: ['employee', 'position'] },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('employee_per_position_idx_system_subscription'),
    employee: () => p.manyToOne(Employee).ref().updateRule('no action').deleteRule('no action'),
    position: () => p.oneToOne(Position).ref().updateRule('no action').deleteRule('no action').comment('Must not exists 2 or more records with same position_id and is_active value in \"true\"').index('employee_per_position_idx_position').unique('employee_per_position_uq_idx_active_position'),
    isActive: p.boolean(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    employeePerPositionValidityCollection: () => p.oneToMany(EmployeePerPositionValidity).mappedBy('employeePerPosition'),
  },
});
