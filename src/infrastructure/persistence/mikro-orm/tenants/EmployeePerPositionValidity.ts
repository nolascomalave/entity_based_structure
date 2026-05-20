import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { EmployeePerPosition } from './EmployeePerPosition';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class EmployeePerPositionValidity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  employeePerPosition!: Ref<EmployeePerPosition>;
  startDate?: Date;
  endDate?: Date;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
}

export const EmployeePerPositionValiditySchema = defineEntity({
  class: EmployeePerPositionValidity,
  schema: 'tenants',
  indexes: [
    {
      name: 'employee_per_position_validity_uq_no_overlap',
      expression: 'CREATE INDEX employee_per_position_validity_uq_no_overlap ON tenants.employee_per_position_validity USING gist (employee_per_position_id, tstzrange(start_date, end_date, \'[)\'::text))',
      type: 'gist',
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('employee_per_position_validity_idx_system_subscription'),
    employeePerPosition: () => p.manyToOne(EmployeePerPosition).ref().updateRule('no action').deleteRule('no action').index('employee_per_position_validity_idx_employee_per_position'),
    startDate: p.datetime().nullable(),
    endDate: p.datetime().nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
  },
});
