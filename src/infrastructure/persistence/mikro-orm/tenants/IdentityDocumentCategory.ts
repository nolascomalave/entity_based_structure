import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { City } from '../osbs/City';
import { Country } from '../osbs/Country';
import { IdentityDocument } from './IdentityDocument';
import { Region } from '../osbs/Region';
import { State } from '../osbs/State';
import { Subregion } from '../osbs/Subregion';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class IdentityDocumentCategory {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  parent!: Ref<IdentityDocumentCategory>;
  region?: Ref<Region>;
  subregion?: Ref<Subregion>;
  country?: Ref<Country>;
  state?: Ref<State>;
  city?: Ref<City>;
  applyToNatural: boolean & Opt = true;
  applyToLegal: boolean & Opt = true;
  category!: string;
  symbol?: string;
  abbreviation?: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  identityDocumentCollection = new Collection<IdentityDocument>(this);
  identityDocumentCategoryCollection = new Collection<IdentityDocumentCategory>(this);
}

export const IdentityDocumentCategorySchema = defineEntity({
  class: IdentityDocumentCategory,
  schema: 'tenants',
  uniques: [
    {
      name: 'identity_document_category_unique',
      properties: [
        'systemSubscription',
        'parent',
        'region',
        'subregion',
        'country',
        'state',
        'city',
      ],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action'),
    parent: () => p.manyToOne(IdentityDocumentCategory).ref().updateRule('no action').deleteRule('no action').index('identity_document_category_idx_parent'),
    region: () => p.manyToOne(Region).ref().updateRule('no action').deleteRule('no action').nullable().index('identity_document_category_idx_region'),
    subregion: () => p.manyToOne(Subregion).ref().updateRule('no action').deleteRule('no action').nullable().index('identity_document_category_idx_subregion'),
    country: () => p.manyToOne(Country).ref().updateRule('no action').deleteRule('no action').nullable().index('identity_document_category_idx_country'),
    state: () => p.manyToOne(State).ref().updateRule('no action').deleteRule('no action').nullable().index('identity_document_category_idx_state'),
    city: () => p.manyToOne(City).ref().updateRule('no action').deleteRule('no action').nullable().index('identity_document_category_idx_city'),
    applyToNatural: p.boolean(),
    applyToLegal: p.boolean(),
    category: p.string().length(250),
    symbol: p.string().length(50).nullable(),
    abbreviation: p.string().length(50).nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    identityDocumentCollection: () => p.oneToMany(IdentityDocument).mappedBy('identityDocumentCategory'),
    identityDocumentCategoryCollection: () => p.oneToMany(IdentityDocumentCategory).mappedBy('parent'),
  },
});
