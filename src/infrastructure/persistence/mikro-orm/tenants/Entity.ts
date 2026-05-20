import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { Branch } from './Branch';
import { Department } from './Department';
import { EmailByEntity } from './EmailByEntity';
import { Employee } from './Employee';
import { EntityAddress } from './EntityAddress';
import { EntityNameByEntity } from './EntityNameByEntity';
import { IdentityDocumentByEntity } from './IdentityDocumentByEntity';
import { JobFamily } from './JobFamily';
import { NaturalEntity } from './NaturalEntity';
import { PhoneByEntity } from './PhoneByEntity';
import { Position } from './Position';
import { Shareholding } from './Shareholding';
import { Subsidiary } from './Subsidiary';
import { SystemSubscription } from '../osbs/SystemSubscription';
import { SystemSubscriptionOwner } from './SystemSubscriptionOwner';

export class Entity {
  id!: string & Opt;
  systemSubscription!: Ref<SystemSubscription>;
  fusionMasterEntity?: Ref<Entity>;
  isNatural: boolean & Opt = false;
  identityDocument?: string;
  name?: string;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  fusionedAt?: Date;
  annulledAt?: Date;
  deletedAt?: Date;
  branchCollection = new Collection<Branch>(this);
  departmentCollection = new Collection<Department>(this);
  emailByEntityCollection = new Collection<EmailByEntity>(this);
  employeeCollection = new Collection<Employee>(this);
  employeeCollection1 = new Collection<Employee>(this);
  entityCollection = new Collection<Entity>(this);
  entityAddressCollection = new Collection<EntityAddress>(this);
  entityNameByEntityCollection = new Collection<EntityNameByEntity>(this);
  identityDocumentByEntityCollection = new Collection<IdentityDocumentByEntity>(this);
  jobFamilyCollection = new Collection<JobFamily>(this);
  naturalEntity?: Ref<NaturalEntity>;
  phoneByEntityCollection = new Collection<PhoneByEntity>(this);
  positionCollection = new Collection<Position>(this);
  shareholdingCollection = new Collection<Shareholding>(this);
  shareholdingCollection1 = new Collection<Shareholding>(this);
  subsidiaryCollection = new Collection<Subsidiary>(this);
  subsidiaryCollection1 = new Collection<Subsidiary>(this);
  systemSubscriptionOwnerCollection = new Collection<SystemSubscriptionOwner>(this);
}

export const EntitySchema = defineEntity({
  class: Entity,
  schema: 'tenants',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    systemSubscription: () => p.manyToOne(SystemSubscription).ref().updateRule('no action').deleteRule('no action').index('entity_idx_system_subscription'),
    fusionMasterEntity: () => p.manyToOne(Entity).ref().updateRule('no action').deleteRule('no action').nullable().comment('This foreign key references the entity that is being fused.').index('entity_idx_fusion_master_entity'),
    isNatural: p.boolean(),
    identityDocument: p.string().length(250).nullable(),
    name: p.string().length(250).nullable(),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    fusionedAt: p.datetime().nullable(),
    annulledAt: p.datetime().nullable(),
    deletedAt: p.datetime().nullable(),
    branchCollection: () => p.oneToMany(Branch).mappedBy('entity'),
    departmentCollection: () => p.oneToMany(Department).mappedBy('entity'),
    emailByEntityCollection: () => p.oneToMany(EmailByEntity).mappedBy('entity'),
    employeeCollection: () => p.oneToMany(Employee).mappedBy('personEntity'),
    employeeCollection1: () => p.oneToMany(Employee).mappedBy('legalEntity'),
    entityCollection: () => p.oneToMany(Entity).mappedBy('fusionMasterEntity'),
    entityAddressCollection: () => p.oneToMany(EntityAddress).mappedBy('entity'),
    entityNameByEntityCollection: () => p.oneToMany(EntityNameByEntity).mappedBy('entity'),
    identityDocumentByEntityCollection: () => p.oneToMany(IdentityDocumentByEntity).mappedBy('entity'),
    jobFamilyCollection: () => p.oneToMany(JobFamily).mappedBy('entity'),
    naturalEntity: () => p.oneToOne(NaturalEntity).ref().mappedBy('entity'),
    phoneByEntityCollection: () => p.oneToMany(PhoneByEntity).mappedBy('entity'),
    positionCollection: () => p.oneToMany(Position).mappedBy('entity'),
    shareholdingCollection: () => p.oneToMany(Shareholding).mappedBy('entity'),
    shareholdingCollection1: () => p.oneToMany(Shareholding).mappedBy('shareholerEntity'),
    subsidiaryCollection: () => p.oneToMany(Subsidiary).mappedBy('entity'),
    subsidiaryCollection1: () => p.oneToMany(Subsidiary).mappedBy('parentEntity'),
    systemSubscriptionOwnerCollection: () => p.oneToMany(SystemSubscriptionOwner).mappedBy('entity'),
  },
});
