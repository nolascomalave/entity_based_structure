import { Collection, type Opt, defineEntity, p } from '@mikro-orm/core';
import { EntityAddress } from '../tenants/EntityAddress';
import { IdentityDocumentCategory } from '../tenants/IdentityDocumentCategory';
import { Subregion } from './Subregion';

export class Region {
  id!: string & Opt;
  name!: string;
  translations?: string;
  createdAt?: Date;
  updatedAt!: Date & Opt;
  flag: number & Opt = 1;
  wikiDataId?: string;
  subregionCollection = new Collection<Subregion>(this);
  entityAddressCollection = new Collection<EntityAddress>(this);
  identityDocumentCategoryCollection = new Collection<IdentityDocumentCategory>(this);
}

export const RegionSchema = defineEntity({
  class: Region,
  schema: 'osbs',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    name: p.string().length(100),
    translations: p.text().nullable(),
    createdAt: p.datetime().columnType('timestamp(6)').nullable(),
    updatedAt: p.datetime().columnType('timestamp(6)').defaultRaw(`CURRENT_TIMESTAMP`),
    flag: p.smallint(),
    wikiDataId: p.string().name('wikiDataId').nullable(),
    subregionCollection: () => p.oneToMany(Subregion).mappedBy('region'),
    entityAddressCollection: () => p.oneToMany(EntityAddress).mappedBy('region'),
    identityDocumentCategoryCollection: () => p.oneToMany(IdentityDocumentCategory).mappedBy('region'),
  },
});
