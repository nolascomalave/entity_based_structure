import { relations } from "drizzle-orm/relations";
import { region, subregion, country, state, city, systemSubscription, systemSubscriptionValidity, phone, auditLog, userAccess, session, systemSubscriptionOwner, entity, systemSubscriptionClient, systemClient, emailByEntity, userAccessValidity, recoveryPassword, recoveryPasswordNotify, phoneByEntity, naturalEntityGender, naturalEntity, identityDocumentCategory, identityDocument, identityDocumentByEntity, entityNameType, entityName, entityNameByEntity, entityAddress, email, department, jobFamily, position, employee, employeeValidity, employeePerPosition, employeePerPositionValidity, shareholding, shareholdingValidity, subsidiary, subsidiaryValidity, branch, identityDocumentByEntityByBranch, entityAddressByBranch, phoneByEntityByBranch, emailByEntityByBranch, attachedDocuments } from "./schema";

export const subregionRelations = relations(subregion, ({one, many}) => ({
	regionInOsb: one(region, {
		fields: [subregion.regionId],
		references: [region.id]
	}),
	country: many(country),
	identityDocumentCategory: many(identityDocumentCategory),
	entityAddress: many(entityAddress),
}));

export const regionRelations = relations(region, ({many}) => ({
	subregion: many(subregion),
	country: many(country),
	identityDocumentCategory: many(identityDocumentCategory),
	entityAddress: many(entityAddress),
}));

export const countryRelations = relations(country, ({one, many}) => ({
	regionInOsb: one(region, {
		fields: [country.regionId],
		references: [region.id]
	}),
	subregionInOsb: one(subregion, {
		fields: [country.subregionId],
		references: [subregion.id]
	}),
	state: many(state),
	city: many(city),
	phone: many(phone),
	identityDocumentCategory: many(identityDocumentCategory),
	entityAddress: many(entityAddress),
}));

export const stateRelations = relations(state, ({one, many}) => ({
	countryInOsb: one(country, {
		fields: [state.countryId],
		references: [country.id]
	}),
	city: many(city),
	phone: many(phone),
	identityDocumentCategory: many(identityDocumentCategory),
	entityAddress: many(entityAddress),
}));

export const cityRelations = relations(city, ({one, many}) => ({
	countryInOsb: one(country, {
		fields: [city.countryId],
		references: [country.id]
	}),
	stateInOsb: one(state, {
		fields: [city.stateId],
		references: [state.id]
	}),
	identityDocumentCategory: many(identityDocumentCategory),
	entityAddress: many(entityAddress),
}));

export const systemSubscriptionValidityRelations = relations(systemSubscriptionValidity, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [systemSubscriptionValidity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
}));

export const systemSubscriptionRelations = relations(systemSubscription, ({many}) => ({
	systemSubscriptionValidity: many(systemSubscriptionValidity),
	auditLog: many(auditLog),
	systemSubscriptionOwner: many(systemSubscriptionOwner),
	systemSubscriptionClient: many(systemSubscriptionClient),
	userAccess: many(userAccess),
	userAccessValidity: many(userAccessValidity),
	session: many(session),
	recoveryPassword: many(recoveryPassword),
	recoveryPasswordNotify: many(recoveryPasswordNotify),
	entity: many(entity),
	naturalEntityGender: many(naturalEntityGender),
	naturalEntity: many(naturalEntity),
	identityDocumentCategory: many(identityDocumentCategory),
	identityDocument: many(identityDocument),
	identityDocumentByEntity: many(identityDocumentByEntity),
	entityNameType: many(entityNameType),
	entityName: many(entityName),
	entityNameByEntity: many(entityNameByEntity),
	entityAddress: many(entityAddress),
	phoneByEntity: many(phoneByEntity),
	emailByEntity: many(emailByEntity),
	department: many(department),
	jobFamily: many(jobFamily),
	position: many(position),
	employee: many(employee),
	employeeValidity: many(employeeValidity),
	employeePerPosition: many(employeePerPosition),
	employeePerPositionValidity: many(employeePerPositionValidity),
	shareholding: many(shareholding),
	shareholdingValidity: many(shareholdingValidity),
	subsidiary: many(subsidiary),
	subsidiaryValidity: many(subsidiaryValidity),
	branch: many(branch),
	identityDocumentByEntityByBranch: many(identityDocumentByEntityByBranch),
	entityAddressByBranch: many(entityAddressByBranch),
	phoneByEntityByBranch: many(phoneByEntityByBranch),
	emailByEntityByBranch: many(emailByEntityByBranch),
	attachedDocuments: many(attachedDocuments),
}));

export const phoneRelations = relations(phone, ({one, many}) => ({
	countryInOsb: one(country, {
		fields: [phone.countryId],
		references: [country.id]
	}),
	stateInOsb: one(state, {
		fields: [phone.stateId],
		references: [state.id]
	}),
	phoneByEntity: many(phoneByEntity),
}));

export const auditLogRelations = relations(auditLog, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [auditLog.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	userAccessInTenant: one(userAccess, {
		fields: [auditLog.userAccessId],
		references: [userAccess.id]
	}),
	sessionInTenant: one(session, {
		fields: [auditLog.sessionId],
		references: [session.id]
	}),
}));

export const userAccessRelations = relations(userAccess, ({one, many}) => ({
	auditLog: many(auditLog),
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [userAccess.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	systemSubscriptionClientInTenant: one(systemSubscriptionClient, {
		fields: [userAccess.systemSubscriptionClientId],
		references: [systemSubscriptionClient.id]
	}),
	emailByEntityInTenant: one(emailByEntity, {
		fields: [userAccess.emailByEntityId],
		references: [emailByEntity.id]
	}),
	userAccessValidity: many(userAccessValidity),
	session: many(session),
	recoveryPassword: many(recoveryPassword),
}));

export const sessionRelations = relations(session, ({one, many}) => ({
	auditLog: many(auditLog),
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [session.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	userAccessInTenant: one(userAccess, {
		fields: [session.userAccessId],
		references: [userAccess.id]
	}),
}));

export const systemSubscriptionOwnerRelations = relations(systemSubscriptionOwner, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [systemSubscriptionOwner.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant: one(entity, {
		fields: [systemSubscriptionOwner.entityId],
		references: [entity.id]
	}),
}));

export const entityRelations = relations(entity, ({one, many}) => ({
	systemSubscriptionOwner: many(systemSubscriptionOwner),
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [entity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant: one(entity, {
		fields: [entity.fusionMasterEntityId],
		references: [entity.id],
		relationName: "entity_fusionMasterEntityId_entity_id"
	}),
	entity: many(entity, {
		relationName: "entity_fusionMasterEntityId_entity_id"
	}),
	naturalEntity: many(naturalEntity),
	identityDocumentByEntity: many(identityDocumentByEntity),
	entityNameByEntity: many(entityNameByEntity),
	entityAddress: many(entityAddress),
	phoneByEntity: many(phoneByEntity),
	emailByEntity: many(emailByEntity),
	department: many(department),
	jobFamily: many(jobFamily),
	position: many(position),
	employee_personEntityId: many(employee, {
		relationName: "employee_personEntityId_entity_id"
	}),
	employee_legalEntityId: many(employee, {
		relationName: "employee_legalEntityId_entity_id"
	}),
	shareholding_entityId: many(shareholding, {
		relationName: "shareholding_entityId_entity_id"
	}),
	shareholding_shareholerEntityId: many(shareholding, {
		relationName: "shareholding_shareholerEntityId_entity_id"
	}),
	subsidiary_entityId: many(subsidiary, {
		relationName: "subsidiary_entityId_entity_id"
	}),
	subsidiary_parentEntityId: many(subsidiary, {
		relationName: "subsidiary_parentEntityId_entity_id"
	}),
	branch: many(branch),
}));

export const systemSubscriptionClientRelations = relations(systemSubscriptionClient, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [systemSubscriptionClient.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	systemClientInOsb: one(systemClient, {
		fields: [systemSubscriptionClient.systemClientId],
		references: [systemClient.id]
	}),
	userAccess: many(userAccess),
}));

export const systemClientRelations = relations(systemClient, ({many}) => ({
	systemSubscriptionClient: many(systemSubscriptionClient),
}));

export const emailByEntityRelations = relations(emailByEntity, ({one, many}) => ({
	userAccess: many(userAccess),
	recoveryPasswordNotify: many(recoveryPasswordNotify),
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [emailByEntity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	emailInOsb: one(email, {
		fields: [emailByEntity.emailId],
		references: [email.id]
	}),
	entityInTenant: one(entity, {
		fields: [emailByEntity.entityId],
		references: [entity.id]
	}),
	emailByEntityByBranch: many(emailByEntityByBranch),
}));

export const userAccessValidityRelations = relations(userAccessValidity, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [userAccessValidity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	userAccessInTenant: one(userAccess, {
		fields: [userAccessValidity.userAccessId],
		references: [userAccess.id]
	}),
}));

export const recoveryPasswordRelations = relations(recoveryPassword, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [recoveryPassword.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	userAccessInTenant: one(userAccess, {
		fields: [recoveryPassword.userAccessId],
		references: [userAccess.id]
	}),
	recoveryPasswordNotify: many(recoveryPasswordNotify),
}));

export const recoveryPasswordNotifyRelations = relations(recoveryPasswordNotify, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [recoveryPasswordNotify.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	recoveryPasswordInTenant: one(recoveryPassword, {
		fields: [recoveryPasswordNotify.recoveryPasswordId],
		references: [recoveryPassword.id]
	}),
	phoneByEntityInTenant: one(phoneByEntity, {
		fields: [recoveryPasswordNotify.phoneByEntityId],
		references: [phoneByEntity.id]
	}),
	emailByEntityInTenant: one(emailByEntity, {
		fields: [recoveryPasswordNotify.emailByEntityId],
		references: [emailByEntity.id]
	}),
}));

export const phoneByEntityRelations = relations(phoneByEntity, ({one, many}) => ({
	recoveryPasswordNotify: many(recoveryPasswordNotify),
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [phoneByEntity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	phoneInOsb: one(phone, {
		fields: [phoneByEntity.phoneId],
		references: [phone.id]
	}),
	entityInTenant: one(entity, {
		fields: [phoneByEntity.entityId],
		references: [entity.id]
	}),
	phoneByEntityByBranch: many(phoneByEntityByBranch),
}));

export const naturalEntityGenderRelations = relations(naturalEntityGender, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [naturalEntityGender.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	naturalEntity: many(naturalEntity),
}));

export const naturalEntityRelations = relations(naturalEntity, ({one}) => ({
	entityInTenant: one(entity, {
		fields: [naturalEntity.entityId],
		references: [entity.id]
	}),
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [naturalEntity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	naturalEntityGenderInTenant: one(naturalEntityGender, {
		fields: [naturalEntity.naturalEntityGenderId],
		references: [naturalEntityGender.id]
	}),
}));

export const identityDocumentCategoryRelations = relations(identityDocumentCategory, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [identityDocumentCategory.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	identityDocumentCategoryInTenant: one(identityDocumentCategory, {
		fields: [identityDocumentCategory.parentId],
		references: [identityDocumentCategory.id],
		relationName: "identityDocumentCategory_parentId_identityDocumentCategory_id"
	}),
	identityDocumentCategory: many(identityDocumentCategory, {
		relationName: "identityDocumentCategory_parentId_identityDocumentCategory_id"
	}),
	regionInOsb: one(region, {
		fields: [identityDocumentCategory.regionId],
		references: [region.id]
	}),
	subregionInOsb: one(subregion, {
		fields: [identityDocumentCategory.subregionId],
		references: [subregion.id]
	}),
	countryInOsb: one(country, {
		fields: [identityDocumentCategory.countryId],
		references: [country.id]
	}),
	stateInOsb: one(state, {
		fields: [identityDocumentCategory.stateId],
		references: [state.id]
	}),
	cityInOsb: one(city, {
		fields: [identityDocumentCategory.cityId],
		references: [city.id]
	}),
	identityDocument: many(identityDocument),
}));

export const identityDocumentRelations = relations(identityDocument, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [identityDocument.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	identityDocumentCategoryInTenant: one(identityDocumentCategory, {
		fields: [identityDocument.identityDocumentCategoryId],
		references: [identityDocumentCategory.id]
	}),
	identityDocumentByEntity: many(identityDocumentByEntity),
}));

export const identityDocumentByEntityRelations = relations(identityDocumentByEntity, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [identityDocumentByEntity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant: one(entity, {
		fields: [identityDocumentByEntity.entityId],
		references: [entity.id]
	}),
	identityDocumentInTenant: one(identityDocument, {
		fields: [identityDocumentByEntity.identityDocumentId],
		references: [identityDocument.id]
	}),
	identityDocumentByEntityByBranch: many(identityDocumentByEntityByBranch),
}));

export const entityNameTypeRelations = relations(entityNameType, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [entityNameType.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityNameByEntity: many(entityNameByEntity),
}));

export const entityNameRelations = relations(entityName, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [entityName.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityNameByEntity: many(entityNameByEntity),
}));

export const entityNameByEntityRelations = relations(entityNameByEntity, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [entityNameByEntity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant: one(entity, {
		fields: [entityNameByEntity.entityId],
		references: [entity.id]
	}),
	entityNameInTenant: one(entityName, {
		fields: [entityNameByEntity.entityNameId],
		references: [entityName.id]
	}),
	entityNameTypeInTenant: one(entityNameType, {
		fields: [entityNameByEntity.entityNameTypeId],
		references: [entityNameType.id]
	}),
}));

export const entityAddressRelations = relations(entityAddress, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [entityAddress.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	regionInOsb: one(region, {
		fields: [entityAddress.regionId],
		references: [region.id]
	}),
	subregionInOsb: one(subregion, {
		fields: [entityAddress.subregionId],
		references: [subregion.id]
	}),
	countryInOsb: one(country, {
		fields: [entityAddress.countryId],
		references: [country.id]
	}),
	stateInOsb: one(state, {
		fields: [entityAddress.stateId],
		references: [state.id]
	}),
	cityInOsb: one(city, {
		fields: [entityAddress.cityId],
		references: [city.id]
	}),
	entityInTenant: one(entity, {
		fields: [entityAddress.entityId],
		references: [entity.id]
	}),
	entityAddressByBranch: many(entityAddressByBranch),
}));

export const emailRelations = relations(email, ({many}) => ({
	emailByEntity: many(emailByEntity),
}));

export const departmentRelations = relations(department, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [department.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant: one(entity, {
		fields: [department.entityId],
		references: [entity.id]
	}),
	departmentInTenant: one(department, {
		fields: [department.parentId],
		references: [department.id],
		relationName: "department_parentId_department_id"
	}),
	department: many(department, {
		relationName: "department_parentId_department_id"
	}),
	position: many(position),
}));

export const jobFamilyRelations = relations(jobFamily, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [jobFamily.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant: one(entity, {
		fields: [jobFamily.entityId],
		references: [entity.id]
	}),
	position: many(position),
}));

export const positionRelations = relations(position, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [position.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant: one(entity, {
		fields: [position.entityId],
		references: [entity.id]
	}),
	positionInTenant: one(position, {
		fields: [position.parentId],
		references: [position.id],
		relationName: "position_parentId_position_id"
	}),
	position: many(position, {
		relationName: "position_parentId_position_id"
	}),
	jobFamilyInTenant: one(jobFamily, {
		fields: [position.jobFamilyId],
		references: [jobFamily.id]
	}),
	departmentInTenant: one(department, {
		fields: [position.departmentId],
		references: [department.id]
	}),
	employeePerPosition: many(employeePerPosition),
	branch: many(branch),
}));

export const employeeRelations = relations(employee, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [employee.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant_personEntityId: one(entity, {
		fields: [employee.personEntityId],
		references: [entity.id],
		relationName: "employee_personEntityId_entity_id"
	}),
	entityInTenant_legalEntityId: one(entity, {
		fields: [employee.legalEntityId],
		references: [entity.id],
		relationName: "employee_legalEntityId_entity_id"
	}),
	employeeValidity: many(employeeValidity),
	employeePerPosition: many(employeePerPosition),
}));

export const employeeValidityRelations = relations(employeeValidity, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [employeeValidity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	employeeInTenant: one(employee, {
		fields: [employeeValidity.employeeId],
		references: [employee.id]
	}),
}));

export const employeePerPositionRelations = relations(employeePerPosition, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [employeePerPosition.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	employeeInTenant: one(employee, {
		fields: [employeePerPosition.employeeId],
		references: [employee.id]
	}),
	positionInTenant: one(position, {
		fields: [employeePerPosition.positionId],
		references: [position.id]
	}),
	employeePerPositionValidity: many(employeePerPositionValidity),
}));

export const employeePerPositionValidityRelations = relations(employeePerPositionValidity, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [employeePerPositionValidity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	employeePerPositionInTenant: one(employeePerPosition, {
		fields: [employeePerPositionValidity.employeePerPositionId],
		references: [employeePerPosition.id]
	}),
}));

export const shareholdingRelations = relations(shareholding, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [shareholding.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant_entityId: one(entity, {
		fields: [shareholding.entityId],
		references: [entity.id],
		relationName: "shareholding_entityId_entity_id"
	}),
	entityInTenant_shareholerEntityId: one(entity, {
		fields: [shareholding.shareholerEntityId],
		references: [entity.id],
		relationName: "shareholding_shareholerEntityId_entity_id"
	}),
	shareholdingValidity: many(shareholdingValidity),
}));

export const shareholdingValidityRelations = relations(shareholdingValidity, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [shareholdingValidity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	shareholdingInTenant: one(shareholding, {
		fields: [shareholdingValidity.shareholdingId],
		references: [shareholding.id]
	}),
}));

export const subsidiaryRelations = relations(subsidiary, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [subsidiary.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant_entityId: one(entity, {
		fields: [subsidiary.entityId],
		references: [entity.id],
		relationName: "subsidiary_entityId_entity_id"
	}),
	entityInTenant_parentEntityId: one(entity, {
		fields: [subsidiary.parentEntityId],
		references: [entity.id],
		relationName: "subsidiary_parentEntityId_entity_id"
	}),
	subsidiaryValidity: many(subsidiaryValidity),
	branch: many(branch),
}));

export const subsidiaryValidityRelations = relations(subsidiaryValidity, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [subsidiaryValidity.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	subsidiaryInTenant: one(subsidiary, {
		fields: [subsidiaryValidity.subsidiaryId],
		references: [subsidiary.id]
	}),
}));

export const branchRelations = relations(branch, ({one, many}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [branch.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	entityInTenant: one(entity, {
		fields: [branch.entityId],
		references: [entity.id]
	}),
	branchInTenant: one(branch, {
		fields: [branch.parentId],
		references: [branch.id],
		relationName: "branch_parentId_branch_id"
	}),
	branch: many(branch, {
		relationName: "branch_parentId_branch_id"
	}),
	positionInTenant: one(position, {
		fields: [branch.positionId],
		references: [position.id]
	}),
	subsidiaryInTenant: one(subsidiary, {
		fields: [branch.subsidiaryId],
		references: [subsidiary.id]
	}),
	identityDocumentByEntityByBranch: many(identityDocumentByEntityByBranch),
	entityAddressByBranch: many(entityAddressByBranch),
	phoneByEntityByBranch: many(phoneByEntityByBranch),
	emailByEntityByBranch: many(emailByEntityByBranch),
}));

export const identityDocumentByEntityByBranchRelations = relations(identityDocumentByEntityByBranch, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [identityDocumentByEntityByBranch.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	branchInTenant: one(branch, {
		fields: [identityDocumentByEntityByBranch.branchId],
		references: [branch.id]
	}),
	identityDocumentByEntityInTenant: one(identityDocumentByEntity, {
		fields: [identityDocumentByEntityByBranch.identityDocumentByEntityId],
		references: [identityDocumentByEntity.id]
	}),
}));

export const entityAddressByBranchRelations = relations(entityAddressByBranch, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [entityAddressByBranch.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	branchInTenant: one(branch, {
		fields: [entityAddressByBranch.branchId],
		references: [branch.id]
	}),
	entityAddressInTenant: one(entityAddress, {
		fields: [entityAddressByBranch.entityAddressId],
		references: [entityAddress.id]
	}),
}));

export const phoneByEntityByBranchRelations = relations(phoneByEntityByBranch, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [phoneByEntityByBranch.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	branchInTenant: one(branch, {
		fields: [phoneByEntityByBranch.branchId],
		references: [branch.id]
	}),
	phoneByEntityInTenant: one(phoneByEntity, {
		fields: [phoneByEntityByBranch.phoneByEntityId],
		references: [phoneByEntity.id]
	}),
}));

export const emailByEntityByBranchRelations = relations(emailByEntityByBranch, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [emailByEntityByBranch.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
	branchInTenant: one(branch, {
		fields: [emailByEntityByBranch.branchId],
		references: [branch.id]
	}),
	emailByEntityInTenant: one(emailByEntity, {
		fields: [emailByEntityByBranch.emailByEntityId],
		references: [emailByEntity.id]
	}),
}));

export const attachedDocumentsRelations = relations(attachedDocuments, ({one}) => ({
	systemSubscriptionInOsb: one(systemSubscription, {
		fields: [attachedDocuments.systemSubscriptionId],
		references: [systemSubscription.id]
	}),
}));