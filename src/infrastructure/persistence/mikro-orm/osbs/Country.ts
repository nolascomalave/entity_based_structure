import { Collection, type Opt, defineEntity, p } from '@mikro-orm/core';
import { City } from './City';
import { EntityAddress } from '../tenants/EntityAddress';
import { IdentityDocumentCategory } from '../tenants/IdentityDocumentCategory';
import { Phone } from './Phone';
import { State } from './State';

export class Country {
  id!: string & Opt;
  region?: string;
  subregion?: string;
  name!: string;
  iso3?: string;
  numericCode?: string;
  iso2?: string;
  phonecode?: string;
  capital?: string;
  currency?: string;
  currencyName?: string;
  currencySymbol?: string;
  tld?: string;
  native?: string;
  population?: bigint;
  gdp?: bigint;
  nationality?: string;
  areaSqKm?: number;
  postalCodeFormat?: string;
  postalCodeRegex?: string;
  timezones?: string;
  translations?: string;
  latitude?: string;
  longitude?: string;
  emoji?: string;
  emojiU?: string;
  createdAt?: Date;
  updatedAt!: Date & Opt;
  flag: number & Opt = 1;
  wikiDataId?: string;
  cityCollection = new Collection<City>(this);
  phoneCollection = new Collection<Phone>(this);
  stateCollection = new Collection<State>(this);
  entityAddressCollection = new Collection<EntityAddress>(this);
  identityDocumentCategoryCollection = new Collection<IdentityDocumentCategory>(this);
}

export const CountrySchema = defineEntity({
  class: Country,
  schema: 'osbs',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    region: p.string().nullable(),
    subregion: p.string().nullable(),
    name: p.string().length(100),
    iso3: p.character().length(3).nullable(),
    numericCode: p.character().length(3).nullable(),
    iso2: p.character().length(2).nullable(),
    phonecode: p.string().nullable(),
    capital: p.string().nullable(),
    currency: p.string().nullable(),
    currencyName: p.string().nullable(),
    currencySymbol: p.string().nullable(),
    tld: p.string().nullable(),
    native: p.string().nullable(),
    population: p.bigint().nullable(),
    gdp: p.bigint().nullable(),
    nationality: p.string().nullable(),
    areaSqKm: p.double().nullable(),
    postalCodeFormat: p.string().nullable(),
    postalCodeRegex: p.string().nullable(),
    timezones: p.text().nullable(),
    translations: p.text().nullable(),
    latitude: p.decimal().precision(10).scale(8).nullable(),
    longitude: p.decimal().precision(11).scale(8).nullable(),
    emoji: p.string().length(191).nullable(),
    emojiU: p.string().name('emojiU').length(191).nullable(),
    createdAt: p.datetime().columnType('timestamp(6)').nullable(),
    updatedAt: p.datetime().columnType('timestamp(6)').defaultRaw(`CURRENT_TIMESTAMP`),
    flag: p.smallint(),
    wikiDataId: p.string().name('wikiDataId').nullable(),
    cityCollection: () => p.oneToMany(City).mappedBy('country'),
    phoneCollection: () => p.oneToMany(Phone).mappedBy('country'),
    stateCollection: () => p.oneToMany(State).mappedBy('country'),
    entityAddressCollection: () => p.oneToMany(EntityAddress).mappedBy('country'),
    identityDocumentCategoryCollection: () => p.oneToMany(IdentityDocumentCategory).mappedBy('country'),
  },
});
