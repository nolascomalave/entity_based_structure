import { type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Employee } from './Employee';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class EmployeeValidity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  employee!: Ref<Employee>;
  startDate!: Date;
  endDate?: Date;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
}

export const EmployeeValiditySchema = defineEntity({
  class: EmployeeValidity,
  schema: 'tenants',
  indexes: [
    {
      name: 'employee_validity_uq_no_overlap',
      expression: 'CREATE INDEX employee_validity_uq_no_overlap ON tenants.employee_validity USING gist (employee_id, tstzrange(start_date, end_date, \'[)\'::text))',
      type: 'gist',
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('employee_validity_idx_system_subscription'),
    employee: () => p.manyToOne(Employee).ref().updateRule('no action').deleteRule('no action').index('employee_validity_idx_employee'),
    startDate: p.datetime().comment('The value of this field must not be between the start_date and end_date of another record of same employee.'),
    endDate: p.datetime().nullable().comment('Must not exists 2 records for 1 employee with this field with null value.'),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
  },
});
