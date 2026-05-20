import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { EntityAddress } from '../tenants/EntityAddress';
import { IdentityDocumentCategory } from '../tenants/IdentityDocumentCategory';
import { Region } from './Region';

export class Subregion {
  id!: string & Opt;
  region!: Ref<Region>;
  name!: string;
  translations?: string;
  createdAt?: Date;
  updatedAt!: Date & Opt;
  flag: number & Opt = 1;
  wikiDataId?: string;
  entityAddressCollection = new Collection<EntityAddress>(this);
  identityDocumentCategoryCollection = new Collection<IdentityDocumentCategory>(this);
}

export const SubregionSchema = defineEntity({
  class: Subregion,
  schema: 'osbs',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    region: () => p.manyToOne(Region).ref().updateRule('no action').deleteRule('no action').index('subregion_idx_region'),
    name: p.string().length(100),
    translations: p.text().nullable(),
    createdAt: p.datetime().columnType('timestamp(6)').nullable(),
    updatedAt: p.datetime().columnType('timestamp(6)').defaultRaw(`CURRENT_TIMESTAMP`),
    flag: p.smallint(),
    wikiDataId: p.string().name('wikiDataId').nullable(),
    entityAddressCollection: () => p.oneToMany(EntityAddress).mappedBy('subregion'),
    identityDocumentCategoryCollection: () => p.oneToMany(IdentityDocumentCategory).mappedBy('subregion'),
  },
});
