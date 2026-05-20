import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { EmailByEntityByBranch } from './EmailByEntityByBranch';
import { Entity } from './Entity';
import { EntityAddressByBranch } from './EntityAddressByBranch';
import { IdentityDocumentByEntityByBranch } from './IdentityDocumentByEntityByBranch';
import { PhoneByEntityByBranch } from './PhoneByEntityByBranch';
import { Position } from './Position';
import { Subsidiary } from './Subsidiary';
import { SystemSubscription } from '../osbs/SystemSubscription';

export class Branch {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  entity?: Ref<Entity>;
  parent?: Ref<Branch>;
  position?: Ref<Position>;
  subsidiary?: Ref<Subsidiary>;
  isHeadquarters?: boolean = false;
  code?: string;
  name?: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  annulledAt?: Date;
  deletedAt?: Date;
  branchCollection = new Collection<Branch>(this);
  emailByEntityByBranchCollection = new Collection<EmailByEntityByBranch>(this);
  entityAddressByBranchCollection = new Collection<EntityAddressByBranch>(this);
  identityDocumentByEntityByBranchCollection = new Collection<IdentityDocumentByEntityByBranch>(this);
  phoneByEntityByBranchCollection = new Collection<PhoneByEntityByBranch>(this);
}

export const BranchSchema = defineEntity({
  class: Branch,
  schema: 'tenants',
  uniques: [{ name: 'branch_unique', properties: ['entity', 'parent', 'code'] }],
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('branch_idx_system_subscription'),
    entity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').nullable().comment('Is the legal entity owner of the brach. This field can be null when parent_id field is not null, else this field must be not null.'),
    parent: () => p.manyToOne(Branch).ref().updateRule('no action').deleteRule('no action').nullable().comment('This field can be null when entity_id field is not null, else this field must be not null.').index('branch_idx_parent'),
    position: () => p.manyToOne(Position).ref().updateRule('no action').deleteRule('no action').nullable().comment('Position of branch responsible.').index('branch_idx_position'),
    subsidiary: () => p.manyToOne(Subsidiary).ref().updateRule('no action').deleteRule('no action').nullable().comment('If this point to a subsidiary, then the field annulled_at must not be null.').index('branch_idx_subsidiary'),
    isHeadquarters: p.boolean().nullable(),
    code: p.string().length(50).nullable(),
    name: p.string().length(250).nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    branchCollection: () => p.oneToMany(Branch).mappedBy('parent'),
    emailByEntityByBranchCollection: () => p.oneToMany(EmailByEntityByBranch).mappedBy('branch'),
    entityAddressByBranchCollection: () => p.oneToMany(EntityAddressByBranch).mappedBy('branch'),
    identityDocumentByEntityByBranchCollection: () => p.oneToMany(IdentityDocumentByEntityByBranch).mappedBy('branch'),
    phoneByEntityByBranchCollection: () => p.oneToMany(PhoneByEntityByBranch).mappedBy('branch'),
  },
});
