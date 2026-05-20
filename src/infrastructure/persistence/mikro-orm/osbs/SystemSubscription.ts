import { Collection, type Opt, type Ref, defineEntity, p } from '@mikro-orm/core';
import { AttachedDocuments } from '../tenants/AttachedDocuments';
import { Branch } from '../tenants/Branch';
import { Department } from '../tenants/Department';
import { EmailByEntity } from '../tenants/EmailByEntity';
import { EmailByEntityByBranch } from '../tenants/EmailByEntityByBranch';
import { Employee } from '../tenants/Employee';
import { EmployeePerPosition } from '../tenants/EmployeePerPosition';
import { EmployeePerPositionValidity } from '../tenants/EmployeePerPositionValidity';
import { EmployeeValidity } from '../tenants/EmployeeValidity';
import { Entity } from '../tenants/Entity';
import { EntityAddress } from '../tenants/EntityAddress';
import { EntityAddressByBranch } from '../tenants/EntityAddressByBranch';
import { EntityName } from '../tenants/EntityName';
import { EntityNameByEntity } from '../tenants/EntityNameByEntity';
import { EntityNameType } from '../tenants/EntityNameType';
import { IdentityDocument } from '../tenants/IdentityDocument';
import { IdentityDocumentByEntity } from '../tenants/IdentityDocumentByEntity';
import { IdentityDocumentByEntityByBranch } from '../tenants/IdentityDocumentByEntityByBranch';
import { IdentityDocumentCategory } from '../tenants/IdentityDocumentCategory';
import { JobFamily } from '../tenants/JobFamily';
import { NaturalEntity } from '../tenants/NaturalEntity';
import { NaturalEntityGender } from '../tenants/NaturalEntityGender';
import { PhoneByEntity } from '../tenants/PhoneByEntity';
import { PhoneByEntityByBranch } from '../tenants/PhoneByEntityByBranch';
import { Position } from '../tenants/Position';
import { RecoveryPassword } from '../tenants/RecoveryPassword';
import { RecoveryPasswordNotify } from '../tenants/RecoveryPasswordNotify';
import { Session } from '../tenants/Session';
import { Shareholding } from '../tenants/Shareholding';
import { ShareholdingValidity } from '../tenants/ShareholdingValidity';
import { Subsidiary } from '../tenants/Subsidiary';
import { SubsidiaryValidity } from '../tenants/SubsidiaryValidity';
import { SystemSubscriptionClient } from '../tenants/SystemSubscriptionClient';
import { SystemSubscriptionOwner } from '../tenants/SystemSubscriptionOwner';
import { SystemSubscriptionValidity } from './SystemSubscriptionValidity';
import { AuditLog } from '../tenants/AuditLog';
import { UserAccess } from '../tenants/UserAccess';
import { UserAccessValidity } from '../tenants/UserAccessValidity';

export class SystemSubscription {
  id!: string & Opt;
  createdAt!: Date & Opt;
  updatedAt!: Date & Opt;
  deletedAt?: Date;
  systemSubscriptionValidityCollection = new Collection<SystemSubscriptionValidity>(this);
  attachedDocumentsCollection = new Collection<AttachedDocuments>(this);
  auditLogCollection = new Collection<AuditLog>(this);
  branchCollection = new Collection<Branch>(this);
  departmentCollection = new Collection<Department>(this);
  emailByEntityCollection = new Collection<EmailByEntity>(this);
  emailByEntityByBranchCollection = new Collection<EmailByEntityByBranch>(this);
  employeeCollection = new Collection<Employee>(this);
  employeePerPositionCollection = new Collection<EmployeePerPosition>(this);
  employeePerPositionValidityCollection = new Collection<EmployeePerPositionValidity>(this);
  employeeValidityCollection = new Collection<EmployeeValidity>(this);
  entityCollection = new Collection<Entity>(this);
  entityAddressCollection = new Collection<EntityAddress>(this);
  entityAddressByBranchCollection = new Collection<EntityAddressByBranch>(this);
  entityNameCollection = new Collection<EntityName>(this);
  entityNameByEntityCollection = new Collection<EntityNameByEntity>(this);
  entityNameTypeCollection = new Collection<EntityNameType>(this);
  identityDocumentCollection = new Collection<IdentityDocument>(this);
  identityDocumentByEntityCollection = new Collection<IdentityDocumentByEntity>(this);
  identityDocumentByEntityByBranchCollection = new Collection<IdentityDocumentByEntityByBranch>(this);
  identityDocumentCategoryCollection = new Collection<IdentityDocumentCategory>(this);
  jobFamilyCollection = new Collection<JobFamily>(this);
  naturalEntityCollection = new Collection<NaturalEntity>(this);
  naturalEntityGenderCollection = new Collection<NaturalEntityGender>(this);
  phoneByEntityCollection = new Collection<PhoneByEntity>(this);
  phoneByEntityByBranchCollection = new Collection<PhoneByEntityByBranch>(this);
  positionCollection = new Collection<Position>(this);
  recoveryPasswordCollection = new Collection<RecoveryPassword>(this);
  recoveryPasswordNotifyCollection = new Collection<RecoveryPasswordNotify>(this);
  sessionCollection = new Collection<Session>(this);
  shareholdingCollection = new Collection<Shareholding>(this);
  shareholdingValidityCollection = new Collection<ShareholdingValidity>(this);
  subsidiaryCollection = new Collection<Subsidiary>(this);
  subsidiaryValidityCollection = new Collection<SubsidiaryValidity>(this);
  systemSubscriptionClientCollection = new Collection<SystemSubscriptionClient>(this);
  systemSubscriptionOwner?: Ref<SystemSubscriptionOwner>;
  userAccessCollection = new Collection<UserAccess>(this);
  userAccessValidityCollection = new Collection<UserAccessValidity>(this);
}

export const SystemSubscriptionSchema = defineEntity({
  class: SystemSubscription,
  schema: 'osbs',
  properties: {
    id: p.uuid().primary().defaultRaw(`uuidv7()`),
    createdAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    updatedAt: p.datetime().defaultRaw(`CURRENT_TIMESTAMP`),
    deletedAt: p.datetime().nullable(),
    systemSubscriptionValidityCollection: () => p.oneToMany(SystemSubscriptionValidity).mappedBy('systemSubscription'),
    attachedDocumentsCollection: () => p.oneToMany(AttachedDocuments).mappedBy('systemSubscription'),
    auditLogCollection: () => p.oneToMany(AuditLog).mappedBy('systemSubscription'),
    branchCollection: () => p.oneToMany(Branch).mappedBy('systemSubscription'),
    departmentCollection: () => p.oneToMany(Department).mappedBy('systemSubscription'),
    emailByEntityCollection: () => p.oneToMany(EmailByEntity).mappedBy('systemSubscription'),
    emailByEntityByBranchCollection: () => p.oneToMany(EmailByEntityByBranch).mappedBy('systemSubscription'),
    employeeCollection: () => p.oneToMany(Employee).mappedBy('systemSubscription'),
    employeePerPositionCollection: () => p.oneToMany(EmployeePerPosition).mappedBy('systemSubscription'),
    employeePerPositionValidityCollection: () => p.oneToMany(EmployeePerPositionValidity).mappedBy('systemSubscription'),
    employeeValidityCollection: () => p.oneToMany(EmployeeValidity).mappedBy('systemSubscription'),
    entityCollection: () => p.oneToMany(Entity).mappedBy('systemSubscription'),
    entityAddressCollection: () => p.oneToMany(EntityAddress).mappedBy('systemSubscription'),
    entityAddressByBranchCollection: () => p.oneToMany(EntityAddressByBranch).mappedBy('systemSubscription'),
    entityNameCollection: () => p.oneToMany(EntityName).mappedBy('systemSubscription'),
    entityNameByEntityCollection: () => p.oneToMany(EntityNameByEntity).mappedBy('systemSubscription'),
    entityNameTypeCollection: () => p.oneToMany(EntityNameType).mappedBy('systemSubscription'),
    identityDocumentCollection: () => p.oneToMany(IdentityDocument).mappedBy('systemSubscription'),
    identityDocumentByEntityCollection: () => p.oneToMany(IdentityDocumentByEntity).mappedBy('systemSubscription'),
    identityDocumentByEntityByBranchCollection: () => p.oneToMany(IdentityDocumentByEntityByBranch).mappedBy('systemSubscription'),
    identityDocumentCategoryCollection: () => p.oneToMany(IdentityDocumentCategory).mappedBy('systemSubscription'),
    jobFamilyCollection: () => p.oneToMany(JobFamily).mappedBy('systemSubscription'),
    naturalEntityCollection: () => p.oneToMany(NaturalEntity).mappedBy('systemSubscription'),
    naturalEntityGenderCollection: () => p.oneToMany(NaturalEntityGender).mappedBy('systemSubscription'),
    phoneByEntityCollection: () => p.oneToMany(PhoneByEntity).mappedBy('systemSubscription'),
    phoneByEntityByBranchCollection: () => p.oneToMany(PhoneByEntityByBranch).mappedBy('systemSubscription'),
    positionCollection: () => p.oneToMany(Position).mappedBy('systemSubscription'),
    recoveryPasswordCollection: () => p.oneToMany(RecoveryPassword).mappedBy('systemSubscription'),
    recoveryPasswordNotifyCollection: () => p.oneToMany(RecoveryPasswordNotify).mappedBy('systemSubscription'),
    sessionCollection: () => p.oneToMany(Session).mappedBy('systemSubscription'),
    shareholdingCollection: () => p.oneToMany(Shareholding).mappedBy('systemSubscription'),
    shareholdingValidityCollection: () => p.oneToMany(ShareholdingValidity).mappedBy('systemSubscription'),
    subsidiaryCollection: () => p.oneToMany(Subsidiary).mappedBy('systemSubscription'),
    subsidiaryValidityCollection: () => p.oneToMany(SubsidiaryValidity).mappedBy('systemSubscription'),
    systemSubscriptionClientCollection: () => p.oneToMany(SystemSubscriptionClient).mappedBy('systemSubscription'),
    systemSubscriptionOwner: () => p.oneToOne(SystemSubscriptionOwner).ref().mappedBy('systemSubscription'),
    userAccessCollection: () => p.oneToMany(UserAccess).mappedBy('systemSubscription'),
    userAccessValidityCollection: () => p.oneToMany(UserAccessValidity).mappedBy('systemSubscription'),
  },
});
