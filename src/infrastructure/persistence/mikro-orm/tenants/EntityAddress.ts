import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { City } from '../osbs/City';
import { Country } from '../osbs/Country';
import { Entity } from './Entity';
import { EntityAddressByBranch } from './EntityAddressByBranch';
import { Region } from '../osbs/Region';
import { State } from '../osbs/State';
import { Subregion } from '../osbs/Subregion';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class EntityAddress {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  entity!: Ref<Entity>;
  region?: Ref<Region>;
  subregion?: Ref<Subregion>;
  country!: Ref<Country>;
  state!: Ref<State>;
  city?: Ref<City>;
  postalCode?: number;
  customCity?: string;
  description?: string;
  isPreferred: boolean & Opt = false;
  ordering: number & Opt = 0;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  entityAddressByBranchCollection = new Collection<EntityAddressByBranch>(this);
}

export const EntityAddressSchema = defineEntity({
  class: EntityAddress,
  schema: 'tenants',
  uniques: [
    {
      name: 'entity_address_unique',
      properties: [
        'entity',
        'region',
        'subregion',
        'country',
        'state',
        'city',
        'postalCode',
        'customCity',
      ],
    },
  ],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('entity_address_idx_system_subscription'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action'),
    region: () => p.manyToOne(Region).ref().updateRule('no action').deleteRule('no action').nullable(),
    subregion: () => p.manyToOne(Subregion).ref().updateRule('no action').deleteRule('no action').nullable(),
    country: () => p.manyToOne(Country).ref().updateRule('no action').deleteRule('no action'),
    state: () => p.manyToOne(State).ref().updateRule('no action').deleteRule('no action'),
    city: () => p.manyToOne(City).ref().updateRule('no action').deleteRule('no action').nullable(),
    postalCode: p.integer().nullable(),
    customCity: p.string().length(250).nullable(),
    description: p.text().nullable(),
    isPreferred: p.boolean(),
    ordering: p.integer(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    entityAddressByBranchCollection: () => p.oneToMany(EntityAddressByBranch).mappedBy('entityAddress'),
  },
});
