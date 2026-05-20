import { type Opt, defineEntity, p } from '@mikro-orm/core';

export class AuditLog {
  id!: string & Opt;
  recordId!: string;
  tableName!: string;
  action!: string;
  oldData?: any;
  newData!: any;
  changedAt!: Date & Opt;
}

export const AuditLogSchema = defineEntity({
  class: AuditLog,
  tableName: 'audit_log',
  schema: 'osbs',
  indexes: [
    {
      name: 'audit_log_idx_table_table_record',
      properties: ['tableName', 'recordId'],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    recordId: p.uuid().comment('Is the pointer of the related record.').index('audit_log_idx_table_record'),
    tableName: p.string().length(100).comment('Is the name of table where exists the related record pointered by record_id field.'),
    action: p.string().length(10),
    oldData: p.json().nullable(),
    newData: p.json(),
    changedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
  },
});
