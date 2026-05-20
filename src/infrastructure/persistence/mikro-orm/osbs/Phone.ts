import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Country } from './Country';
import { PhoneByEntity } from '../tenants/PhoneByEntity';
import { State } from './State';

export class Phone {
  id!: string & Opt;
  country!: Ref<Country>;
  state?: Ref<State>;
  phone!: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  phoneByEntityCollection = new Collection<PhoneByEntity>(this);
}

export const PhoneSchema = defineEntity({
  class: Phone,
  schema: 'osbs',
  uniques: [{ name: 'phone_unique', properties: ['country', 'state', 'phone'] }],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    country: () => p.manyToOne(Country).ref().updateRule('no action').deleteRule('no action'),
    state: () => p.manyToOne(State).ref().updateRule('no action').deleteRule('no action').nullable().index('phone_idx_state'),
    phone: p.string().length(50).unique('phone_uq_idx_phone'),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    phoneByEntityCollection: () => p.oneToMany(PhoneByEntity).mappedBy('phone'),
  },
});
