import { Collection, type Opt, defineEntity, p } from '@mikro-orm/core';
import { EmailByEntity } from '../tenants/EmailByEntity';

export class Email {
  id!: string & Opt;
  email!: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  emailByEntityCollection = new Collection<EmailByEntity>(this);
}

export const EmailSchema = defineEntity({
  class: Email,
  schema: 'osbs',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    email: p.string().length(320).unique('email_uq_idx_email'),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    emailByEntityCollection: () => p.oneToMany(EmailByEntity).mappedBy('email'),
  },
});
