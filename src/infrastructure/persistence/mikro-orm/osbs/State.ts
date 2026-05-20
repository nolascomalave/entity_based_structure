import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { City } from './City';
import { Country } from './Country';
import { EntityAddress } from '../tenants/EntityAddress';
import { IdentityDocumentCategory } from '../tenants/IdentityDocumentCategory';
import { Phone } from './Phone';

export class State {
  id!: string & Opt;
  name!: string;
  country!: Ref<Country>;
  parentId?: string;
  countryCode!: string;
  fipsCode?: string;
  iso2?: string;
  iso31662?: string;
  type?: string;
  level?: number;
  native?: string;
  latitude?: string;
  longitude?: string;
  timezone?: string;
  translations?: string;
  createdAt?: Date;
  updatedAt!: Date & Opt;
  flag: number & Opt = 1;
  wikiDataId?: string;
  population?: string;
  cityCollection = new Collection<City>(this);
  phoneCollection = new Collection<Phone>(this);
  entityAddressCollection = new Collection<EntityAddress>(this);
  identityDocumentCategoryCollection = new Collection<IdentityDocumentCategory>(this);
}

export const StateSchema = defineEntity({
  class: State,
  schema: 'osbs',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    name: p.string(),
    country: () => p.manyToOne(Country).ref().updateRule('no action').deleteRule('no action').index('state_idx_country'),
    parentId: p.uuid().nullable(),
    countryCode: p.character().length(2),
    fipsCode: p.string().nullable(),
    iso2: p.string().nullable(),
    iso31662: p.string().name('iso3166_2').length(10).nullable(),
    type: p.string().length(191).nullable(),
    level: p.integer().nullable(),
    native: p.string().nullable(),
    latitude: p.decimal().precision(10).scale(8).nullable(),
    longitude: p.decimal().precision(11).scale(8).nullable(),
    timezone: p.string().nullable(),
    translations: p.text().nullable(),
    createdAt: p.datetime().columnType('timestamp(6)').nullable(),
    updatedAt: p.datetime().columnType('timestamp(6)').defaultRaw(`CURRENT_TIMESTAMP`),
    flag: p.smallint(),
    wikiDataId: p.string().name('wikiDataId').nullable(),
    population: p.string().nullable(),
    cityCollection: () => p.oneToMany(City).mappedBy('state'),
    phoneCollection: () => p.oneToMany(Phone).mappedBy('state'),
    entityAddressCollection: () => p.oneToMany(EntityAddress).mappedBy('state'),
    identityDocumentCategoryCollection: () => p.oneToMany(IdentityDocumentCategory).mappedBy('state'),
  },
});
