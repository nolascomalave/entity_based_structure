import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Country } from './Country';
import { EntityAddress } from '../tenants/EntityAddress';
import { IdentityDocumentCategory } from '../tenants/IdentityDocumentCategory';
import { State } from './State';

export class City {
  id!: string & Opt;
  name!: string;
  state!: Ref<State>;
  country!: Ref<Country>;
  parentId?: string;
  stateCode!: string;
  countryCode!: string;
  type?: string;
  level?: number;
  latitude!: string;
  longitude!: string;
  native?: string;
  population?: bigint;
  timezone?: string;
  translations?: string;
  createdAt: Date & Opt = '2014-01-01 12:01:01';
  updatedAt!: Date & Opt;
  flag: number & Opt = 1;
  wikiDataId?: string;
  entityAddressCollection = new Collection<EntityAddress>(this);
  identityDocumentCategoryCollection = new Collection<IdentityDocumentCategory>(this);
}

export const CitySchema = defineEntity({
  class: City,
  schema: 'osbs',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    name: p.string(),
    state: () => p.manyToOne(State).ref().updateRule('no action').deleteRule('no action'),
    country: () => p.manyToOne(Country).ref().updateRule('no action').deleteRule('no action').index('city_idx_country'),
    parentId: p.uuid().nullable(),
    stateCode: p.string(),
    countryCode: p.character().length(2),
    type: p.string().length(191).nullable(),
    level: p.integer().nullable(),
    latitude: p.decimal().precision(10).scale(8),
    longitude: p.decimal().precision(11).scale(8),
    native: p.string().nullable(),
    population: p.bigint().nullable(),
    timezone: p.string().nullable(),
    translations: p.text().nullable(),
    createdAt: p.datetime().columnType('timestamp(6)'),
    updatedAt: p.datetime().columnType('timestamp(6)').defaultRaw(`CURRENT_TIMESTAMP`),
    flag: p.smallint(),
    wikiDataId: p.string().name('wikiDataId').nullable(),
    entityAddressCollection: () => p.oneToMany(EntityAddress).mappedBy('city'),
    identityDocumentCategoryCollection: () => p.oneToMany(IdentityDocumentCategory).mappedBy('city'),
  },
});
