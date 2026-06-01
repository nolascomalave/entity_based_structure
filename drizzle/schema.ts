import { pgSchema, uuid, varchar, text, timestamp, smallint, index, jsonb, foreignKey, char, bigint, doublePrecision, numeric, integer, uniqueIndex, unique, boolean, check, pgPolicy, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const osbs = pgSchema("osbs");
export const tenants = pgSchema("tenants");


export const region = osbs.table("region", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	translations: text(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	flag: smallint().default(1).notNull(),
	wikiDataId: varchar({ length: 255 }),
});

export const auditLogInOsbs = osbs.table("audit_log", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	recordId: uuid("record_id").notNull(),
	tableName: varchar("table_name", { length: 100 }).notNull(),
	action: varchar({ length: 10 }).notNull(),
	oldData: jsonb("old_data"),
	newData: jsonb("new_data").notNull(),
	changedAt: timestamp("changed_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("audit_log_idx_table_record").using("btree", table.recordId.asc().nullsLast().op("uuid_ops")),
	index("audit_log_idx_table_table_record").using("btree", table.tableName.asc().nullsLast().op("text_ops"), table.recordId.asc().nullsLast().op("text_ops")),
]);

export const subregion = osbs.table("subregion", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	regionId: uuid("region_id").notNull(),
	name: varchar({ length: 100 }).notNull(),
	translations: text(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	flag: smallint().default(1).notNull(),
	wikiDataId: varchar({ length: 255 }),
}, (table) => [
	index("subregion_idx_region").using("btree", table.regionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [region.id],
			name: "subregion_region_id_fkey"
		}),
]);

export const country = osbs.table("country", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	regionId: uuid("region_id"),
	subregionId: uuid("subregion_id"),
	region: varchar({ length: 255 }),
	subregion: varchar({ length: 255 }),
	name: varchar({ length: 100 }).notNull(),
	iso3: char({ length: 3 }),
	numericCode: char("numeric_code", { length: 3 }),
	iso2: char({ length: 2 }),
	phonecode: varchar({ length: 255 }),
	capital: varchar({ length: 255 }),
	currency: varchar({ length: 255 }),
	currencyName: varchar("currency_name", { length: 255 }),
	currencySymbol: varchar("currency_symbol", { length: 255 }),
	tld: varchar({ length: 255 }),
	native: varchar({ length: 255 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	population: bigint({ mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	gdp: bigint({ mode: "number" }),
	nationality: varchar({ length: 255 }),
	areaSqKm: doublePrecision("area_sq_km"),
	postalCodeFormat: varchar("postal_code_format", { length: 255 }),
	postalCodeRegex: varchar("postal_code_regex", { length: 255 }),
	timezones: text(),
	translations: text(),
	latitude: numeric({ precision: 10, scale:  8 }),
	longitude: numeric({ precision: 11, scale:  8 }),
	emoji: varchar({ length: 191 }),
	emojiU: varchar({ length: 191 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	flag: smallint().default(1).notNull(),
	wikiDataId: varchar({ length: 255 }),
}, (table) => [
	index("country_idx_region").using("btree", table.regionId.asc().nullsLast().op("uuid_ops")),
	index("country_idx_subregion").using("btree", table.subregionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [region.id],
			name: "country_region_id_fkey"
		}),
	foreignKey({
			columns: [table.subregionId],
			foreignColumns: [subregion.id],
			name: "country_subregion_id_fkey"
		}),
]);

export const state = osbs.table("state", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	countryId: uuid("country_id").notNull(),
	parentId: uuid("parent_id"),
	countryCode: char("country_code", { length: 2 }).notNull(),
	fipsCode: varchar("fips_code", { length: 255 }),
	iso2: varchar({ length: 255 }),
	iso31662: varchar("iso3166_2", { length: 10 }),
	type: varchar({ length: 191 }),
	level: integer(),
	native: varchar({ length: 255 }),
	latitude: numeric({ precision: 10, scale:  8 }),
	longitude: numeric({ precision: 11, scale:  8 }),
	timezone: varchar({ length: 255 }),
	translations: text(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	flag: smallint().default(1).notNull(),
	wikiDataId: varchar({ length: 255 }),
	population: varchar({ length: 255 }),
}, (table) => [
	index("state_idx_country").using("btree", table.countryId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [country.id],
			name: "state_country_id_fkey"
		}),
]);

export const city = osbs.table("city", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	stateId: uuid("state_id").notNull(),
	countryId: uuid("country_id").notNull(),
	parentId: uuid("parent_id"),
	stateCode: varchar("state_code", { length: 255 }).notNull(),
	countryCode: char("country_code", { length: 2 }).notNull(),
	type: varchar({ length: 191 }),
	level: integer(),
	latitude: numeric({ precision: 10, scale:  8 }).notNull(),
	longitude: numeric({ precision: 11, scale:  8 }).notNull(),
	native: varchar({ length: 255 }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	population: bigint({ mode: "number" }),
	timezone: varchar({ length: 255 }),
	translations: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default('2014-01-01 12:01:01').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	flag: smallint().default(1).notNull(),
	wikiDataId: varchar({ length: 255 }),
}, (table) => [
	index("city_idx_country").using("btree", table.countryId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [country.id],
			name: "city_country_id_fkey"
		}),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [state.id],
			name: "city_state_id_fkey"
		}),
]);

export const systemSubscription = osbs.table("system_subscription", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});

export const systemSubscriptionValidity = osbs.table("system_subscription_validity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("system_subscription_validity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "system_subscription_validity_fkey_system_subscription"
		}),
]);

export const phone = osbs.table("phone", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	countryId: uuid("country_id").notNull(),
	stateId: uuid("state_id"),
	phone: varchar({ length: 50 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("phone_idx_state").using("btree", table.stateId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("phone_uq_idx_phone").using("btree", table.phone.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [country.id],
			name: "phone_fkey_country"
		}),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [state.id],
			name: "phone_fkey_state"
		}),
	unique("phone_unique").on(table.countryId, table.phone, table.stateId),
]);

export const systemClient = osbs.table("system_client", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	name: varchar({ length: 250 }).notNull(),
	description: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	uniqueIndex("system_client_uq_idx_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const email = osbs.table("email", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	email: varchar({ length: 320 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	uniqueIndex("email_uq_idx_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	check("email_ck_valid", sql`(email)::text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text`),
]);

export const auditLog = tenants.table("audit_log", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	userAccessId: uuid("user_access_id"),
	sessionId: uuid("session_id"),
	recordId: uuid("record_id").notNull(),
	tableName: varchar("table_name", { length: 100 }).notNull(),
	action: varchar({ length: 10 }).notNull(),
	oldData: jsonb("old_data"),
	newData: jsonb("new_data").notNull(),
	changedAt: timestamp("changed_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("audit_log_idx_record").using("btree", table.recordId.asc().nullsLast().op("uuid_ops")),
	index("audit_log_idx_session").using("btree", table.sessionId.asc().nullsLast().op("uuid_ops")),
	index("audit_log_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	index("audit_log_idx_table_record").using("btree", table.tableName.asc().nullsLast().op("uuid_ops"), table.recordId.asc().nullsLast().op("text_ops")),
	index("audit_log_idx_user_access").using("btree", table.userAccessId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "audit_log_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.userAccessId],
			foreignColumns: [userAccess.id],
			name: "audit_log_fkey_user_access"
		}),
	foreignKey({
			columns: [table.sessionId],
			foreignColumns: [session.id],
			name: "audit_log_fkey_session"
		}).onDelete("set null"),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const systemSubscriptionOwner = tenants.table("system_subscription_owner", {
	systemSubscriptionId: uuid("system_subscription_id").primaryKey().notNull(),
	entityId: uuid("entity_id").notNull(),
}, (table) => [
	index("system_subscription_owner_idx_entity").using("btree", table.entityId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "system_subscription_owner_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "system_subscription_owner_fkey_entity"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const systemSubscriptionClient = tenants.table("system_subscription_client", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	systemClientId: uuid("system_client_id"),
	name: varchar({ length: 250 }).notNull(),
	description: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("system_subscription_client_idx_system_client").using("btree", table.systemClientId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "system_subscription_client_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.systemClientId],
			foreignColumns: [systemClient.id],
			name: "system_subscription_client_fkey_system_client"
		}),
	unique("system_subscription_client_unique").on(table.name, table.systemSubscriptionId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const userAccess = tenants.table("user_access", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	systemSubscriptionClientId: uuid("system_subscription_client_id").notNull(),
	emailByEntityId: uuid("email_by_entity_id").notNull(),
	password: text().notNull(),
	isActive: boolean("is_active").default(true).notNull(),
}, (table) => [
	index("user_access_idx_email_by_entity").using("btree", table.emailByEntityId.asc().nullsLast().op("uuid_ops")),
	index("user_access_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "user_access_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.systemSubscriptionClientId],
			foreignColumns: [systemSubscriptionClient.id],
			name: "user_access_fkey_system_subscription_client"
		}),
	foreignKey({
			columns: [table.emailByEntityId],
			foreignColumns: [emailByEntity.id],
			name: "user_access_fkey_email_by_entity"
		}),
	unique("user_access_unique").on(table.emailByEntityId, table.systemSubscriptionClientId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const userAccessValidity = tenants.table("user_access_validity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	userAccessId: uuid("user_access_id").notNull(),
	startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("user_access_validity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	index("user_access_validity_idx_user_access").using("btree", table.userAccessId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "user_access_validity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.userAccessId],
			foreignColumns: [userAccess.id],
			name: "user_access_validity_fkey_user_access"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const session = tenants.table("session", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	userAccessId: uuid("user_access_id"),
	refreshtoken: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("session_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	index("session_idx_user_access").using("btree", table.userAccessId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "session_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.userAccessId],
			foreignColumns: [userAccess.id],
			name: "session_fkey_user_access"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const recoveryPassword = tenants.table("recovery_password", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	userAccessId: uuid("user_access_id"),
	validityCode: varchar("validity_code", { length: 10 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	usedAt: timestamp("used_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("recovery_password_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	index("recovery_password_idx_user_access").using("btree", table.userAccessId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "recovery_password_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.userAccessId],
			foreignColumns: [userAccess.id],
			name: "recovery_password_fkey_user_access"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const recoveryPasswordNotify = tenants.table("recovery_password_notify", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	recoveryPasswordId: uuid("recovery_password_id").notNull(),
	phoneByEntityId: uuid("phone_by_entity_id"),
	emailByEntityId: uuid("email_by_entity_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("recovery_password_notify_idx_recovery_password").using("btree", table.recoveryPasswordId.asc().nullsLast().op("uuid_ops")),
	index("recovery_password_notify_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "recovery_password_notify_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.recoveryPasswordId],
			foreignColumns: [recoveryPassword.id],
			name: "recovery_password_notify_fkey_recovery_password"
		}),
	foreignKey({
			columns: [table.phoneByEntityId],
			foreignColumns: [phoneByEntity.id],
			name: "recovery_password_notify_fkey_phone_by_entity"
		}),
	foreignKey({
			columns: [table.emailByEntityId],
			foreignColumns: [emailByEntity.id],
			name: "recovery_password_notify_fkey_email_by_entity"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
	check("recovery_password_notify_ck_notify_method", sql`(phone_by_entity_id IS NOT NULL) OR (email_by_entity_id IS NOT NULL)`),
]);

export const entity = tenants.table("entity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	fusionMasterEntityId: uuid("fusion_master_entity_id"),
	isNatural: boolean("is_natural").default(false).notNull(),
	identityDocument: varchar("identity_document", { length: 250 }),
	name: varchar({ length: 250 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	fusionedAt: timestamp("fusioned_at", { withTimezone: true, mode: 'string' }),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("entity_idx_fusion_master_entity").using("btree", table.fusionMasterEntityId.asc().nullsLast().op("uuid_ops")),
	index("entity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "entity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.fusionMasterEntityId],
			foreignColumns: [table.id],
			name: "entity_fkey_fusion_master_entity"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
	check("entity_ck_fusion", sql`((fusion_master_entity_id IS NOT NULL) AND (fusioned_at IS NOT NULL)) OR ((fusion_master_entity_id IS NULL) AND (fusioned_at IS NULL))`),
]);

export const naturalEntityGender = tenants.table("natural_entity_gender", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	gender: varchar({ length: 100 }).notNull(),
	description: varchar({ length: 2500 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "natural_entity_gender_fkey_system_subscription"
		}),
	unique("natural_entity_gender_unique").on(table.gender, table.systemSubscriptionId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const naturalEntity = tenants.table("natural_entity", {
	entityId: uuid("entity_id").primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	naturalEntityGenderId: uuid("natural_entity_gender_id").notNull(),
	birthDate: date("birth_date"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("natural_entity_idx_natural_entity_gender").using("btree", table.naturalEntityGenderId.asc().nullsLast().op("uuid_ops")),
	index("natural_entity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "natural_entity_fkey_entity"
		}),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "natural_entity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.naturalEntityGenderId],
			foreignColumns: [naturalEntityGender.id],
			name: "natural_entity_fkey_natural_entity_gender"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const identityDocumentCategory = tenants.table("identity_document_category", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	parentId: uuid("parent_id").notNull(),
	regionId: uuid("region_id"),
	subregionId: uuid("subregion_id"),
	countryId: uuid("country_id"),
	stateId: uuid("state_id"),
	cityId: uuid("city_id"),
	applyToNatural: boolean("apply_to_natural").default(true).notNull(),
	applyToLegal: boolean("apply_to_legal").default(true).notNull(),
	category: varchar({ length: 250 }).notNull(),
	symbol: varchar({ length: 50 }),
	abbreviation: varchar({ length: 50 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("identity_document_category_idx_city").using("btree", table.cityId.asc().nullsLast().op("uuid_ops")),
	index("identity_document_category_idx_country").using("btree", table.countryId.asc().nullsLast().op("uuid_ops")),
	index("identity_document_category_idx_parent").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index("identity_document_category_idx_region").using("btree", table.regionId.asc().nullsLast().op("uuid_ops")),
	index("identity_document_category_idx_state").using("btree", table.stateId.asc().nullsLast().op("uuid_ops")),
	index("identity_document_category_idx_subregion").using("btree", table.subregionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "identity_document_category_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "identity_document_category_fkey_parent"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [region.id],
			name: "identity_document_category_fkey_region"
		}),
	foreignKey({
			columns: [table.subregionId],
			foreignColumns: [subregion.id],
			name: "identity_document_category_fkey_subregion"
		}),
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [country.id],
			name: "identity_document_category_fkey_country"
		}),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [state.id],
			name: "identity_document_category_fkey_state"
		}),
	foreignKey({
			columns: [table.cityId],
			foreignColumns: [city.id],
			name: "identity_document_category_fkey_city"
		}),
	unique("identity_document_category_unique").on(table.cityId, table.countryId, table.parentId, table.regionId, table.stateId, table.subregionId, table.systemSubscriptionId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
	check("identity_document_category_ck_apply_to", sql`(apply_to_natural = true) OR (apply_to_legal = true)`),
]);

export const identityDocument = tenants.table("identity_document", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	identityDocumentCategoryId: uuid("identity_document_category_id").notNull(),
	document: varchar({ length: 250 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("identity_document_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "identity_document_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.identityDocumentCategoryId],
			foreignColumns: [identityDocumentCategory.id],
			name: "identity_document_fkey_identity_document_category"
		}),
	unique("identity_document_unique").on(table.document, table.identityDocumentCategoryId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const identityDocumentByEntity = tenants.table("identity_document_by_entity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	entityId: uuid("entity_id").notNull(),
	identityDocumentId: uuid("identity_document_id").notNull(),
	description: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	ordering: bigint({ mode: "number" }).default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("identity_document_by_entity_idx_identity_document").using("btree", table.identityDocumentId.asc().nullsLast().op("uuid_ops")),
	index("identity_document_by_entity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "identity_document_by_entity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "identity_document_by_entity_fkey_entity"
		}),
	foreignKey({
			columns: [table.identityDocumentId],
			foreignColumns: [identityDocument.id],
			name: "identity_document_by_entity_fkey_identity_document"
		}),
	unique("identity_document_by_entity_unique").on(table.entityId, table.identityDocumentId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const entityNameType = tenants.table("entity_name_type", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	type: varchar({ length: 50 }).notNull(),
	applyToNatural: boolean("apply_to_natural").default(true).notNull(),
	applyToLegal: boolean("apply_to_legal").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "entity_name_type_fkey_system_subscription"
		}),
	unique("entity_name_type_unique").on(table.systemSubscriptionId, table.type),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const entityName = tenants.table("entity_name", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	name: varchar({ length: 250 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "entity_name_fkey_system_subscription"
		}),
	unique("entity_name_unique").on(table.name, table.systemSubscriptionId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const entityNameByEntity = tenants.table("entity_name_by_entity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	entityId: uuid("entity_id").notNull(),
	entityNameId: uuid("entity_name_id").notNull(),
	entityNameTypeId: uuid("entity_name_type_id").notNull(),
	orderingByType: integer("ordering_by_type").default(0).notNull(),
	description: text(),
	ordering: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("entity_name_by_entity_idx_entity_name").using("btree", table.entityNameId.asc().nullsLast().op("uuid_ops")),
	index("entity_name_by_entity_idx_entity_name_type").using("btree", table.entityNameTypeId.asc().nullsLast().op("uuid_ops")),
	index("entity_name_by_entity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "entity_name_by_entity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "entity_name_by_entity_fkey_entity"
		}),
	foreignKey({
			columns: [table.entityNameId],
			foreignColumns: [entityName.id],
			name: "entity_name_by_entity_fkey_entity_name"
		}),
	foreignKey({
			columns: [table.entityNameTypeId],
			foreignColumns: [entityNameType.id],
			name: "entity_name_by_entity_fkey_entity_name_type"
		}),
	unique("entity_name_by_entity_unique").on(table.entityId, table.entityNameId, table.entityNameTypeId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const entityAddress = tenants.table("entity_address", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	entityId: uuid("entity_id").notNull(),
	regionId: uuid("region_id"),
	subregionId: uuid("subregion_id"),
	countryId: uuid("country_id").notNull(),
	stateId: uuid("state_id").notNull(),
	cityId: uuid("city_id"),
	postalCode: integer("postal_code"),
	customCity: varchar("custom_city", { length: 250 }),
	description: text(),
	isPreferred: boolean("is_preferred").default(false).notNull(),
	ordering: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("entity_address_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "entity_address_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.regionId],
			foreignColumns: [region.id],
			name: "entity_address_fkey_region"
		}),
	foreignKey({
			columns: [table.subregionId],
			foreignColumns: [subregion.id],
			name: "entity_address_fkey_subregion"
		}),
	foreignKey({
			columns: [table.countryId],
			foreignColumns: [country.id],
			name: "entity_address_fkey_country"
		}),
	foreignKey({
			columns: [table.stateId],
			foreignColumns: [state.id],
			name: "entity_address_fkey_state"
		}),
	foreignKey({
			columns: [table.cityId],
			foreignColumns: [city.id],
			name: "entity_address_fkey_city"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "entity_address_fkey_entity"
		}),
	unique("entity_address_unique").on(table.cityId, table.countryId, table.customCity, table.entityId, table.postalCode, table.regionId, table.stateId, table.subregionId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const phoneByEntity = tenants.table("phone_by_entity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	phoneId: uuid("phone_id").notNull(),
	entityId: uuid("entity_id").notNull(),
	preferred: boolean().default(false).notNull(),
	description: text(),
	ordering: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("phone_by_entity_idx_entity").using("btree", table.entityId.asc().nullsLast().op("uuid_ops")),
	index("phone_by_entity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	index("recovery_password_notify_idx_phone_by_entity").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "phone_by_entity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.phoneId],
			foreignColumns: [phone.id],
			name: "phone_by_entity_fkey_phone"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "phone_by_entity_fkey_entity"
		}),
	unique("phone_by_entity_unique").on(table.entityId, table.phoneId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const emailByEntity = tenants.table("email_by_entity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	emailId: uuid("email_id").notNull(),
	entityId: uuid("entity_id").notNull(),
	preferred: boolean().default(false).notNull(),
	description: text(),
	ordering: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("email_by_entity_idx_entity").using("btree", table.entityId.asc().nullsLast().op("uuid_ops")),
	index("email_by_entity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	index("recovery_password_notify_idx_email_by_entity").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "email_by_entity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.emailId],
			foreignColumns: [email.id],
			name: "email_by_entity_fkey_email"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "email_by_entity_fkey_entity"
		}),
	unique("email_by_entity_unique").on(table.emailId, table.entityId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const department = tenants.table("department", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	entityId: uuid("entity_id"),
	parentId: uuid("parent_id"),
	name: varchar({ length: 250 }).notNull(),
	description: text(),
	code: varchar({ length: 50 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("department_idx_parent").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index("department_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "department_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "department_fkey_entity"
		}),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "department_fkey_parent"
		}),
	unique("department_unique").on(table.entityId, table.name, table.parentId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
	check("department_ck_fusion", sql`((entity_id IS NOT NULL) AND (parent_id IS NULL)) OR ((entity_id IS NULL) AND (parent_id IS NOT NULL))`),
]);

export const jobFamily = tenants.table("job_family", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	entityId: uuid("entity_id").notNull(),
	name: varchar({ length: 250 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("job_family_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "job_family_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "job_family_fkey_entity"
		}),
	unique("job_family_unique").on(table.entityId, table.name),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const position = tenants.table("position", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	entityId: uuid("entity_id"),
	parentId: uuid("parent_id"),
	jobFamilyId: uuid("job_family_id"),
	departmentId: uuid("department_id"),
	name: varchar({ length: 250 }).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("position_idx_department").using("btree", table.departmentId.asc().nullsLast().op("uuid_ops")),
	index("position_idx_job_family").using("btree", table.jobFamilyId.asc().nullsLast().op("uuid_ops")),
	index("position_idx_parent").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index("position_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "position_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "position_fkey_entity"
		}),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "position_fkey_parent"
		}),
	foreignKey({
			columns: [table.jobFamilyId],
			foreignColumns: [jobFamily.id],
			name: "position_fkey_job_family"
		}),
	foreignKey({
			columns: [table.departmentId],
			foreignColumns: [department.id],
			name: "position_fkey_department"
		}),
	unique("position_unique").on(table.departmentId, table.entityId, table.jobFamilyId, table.name, table.parentId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const employee = tenants.table("employee", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	personEntityId: uuid("person_entity_id").notNull(),
	legalEntityId: uuid("legal_entity_id").notNull(),
	employeeCode: varchar("employee_code", { length: 100 }).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("employee_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "employee_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.personEntityId],
			foreignColumns: [entity.id],
			name: "employee_fkey_person_entity"
		}),
	foreignKey({
			columns: [table.legalEntityId],
			foreignColumns: [entity.id],
			name: "employee_fkey_legal_entity"
		}),
	unique("employee_unique_person").on(table.legalEntityId, table.personEntityId),
	unique("employee_unique_code").on(table.employeeCode, table.legalEntityId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const employeeValidity = tenants.table("employee_validity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	employeeId: uuid("employee_id").notNull(),
	startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("employee_validity_idx_employee").using("btree", table.employeeId.asc().nullsLast().op("uuid_ops")),
	index("employee_validity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "employee_validity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employee.id],
			name: "employee_validity_fkey_employee"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const employeePerPosition = tenants.table("employee_per_position", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	employeeId: uuid("employee_id").notNull(),
	positionId: uuid("position_id").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("employee_per_position_idx_position").using("btree", table.positionId.asc().nullsLast().op("uuid_ops")),
	index("employee_per_position_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("employee_per_position_uq_idx_active_position").using("btree", table.positionId.asc().nullsLast().op("uuid_ops")).where(sql`(is_active = true)`),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "employee_per_position_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.employeeId],
			foreignColumns: [employee.id],
			name: "employee_per_position_fkey_employee"
		}),
	foreignKey({
			columns: [table.positionId],
			foreignColumns: [position.id],
			name: "employee_per_position_fkey_position"
		}),
	unique("employee_per_position_unique").on(table.employeeId, table.positionId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const employeePerPositionValidity = tenants.table("employee_per_position_validity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	employeePerPositionId: uuid("employee_per_position_id").notNull(),
	startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }),
	endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("employee_per_position_validity_idx_employee_per_position").using("btree", table.employeePerPositionId.asc().nullsLast().op("uuid_ops")),
	index("employee_per_position_validity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "employee_per_position_validity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.employeePerPositionId],
			foreignColumns: [employeePerPosition.id],
			name: "employee_per_position_validity_fkey_employee_per_position"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const shareholding = tenants.table("shareholding", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	entityId: uuid("entity_id").notNull(),
	shareholerEntityId: uuid("shareholer_entity_id").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	ownershipPercentage: numeric("ownership_percentage", { precision: 5, scale:  2 }),
	sharesQuantity: integer("shares_quantity"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("shareholding_idx_shareholer_entity").using("btree", table.shareholerEntityId.asc().nullsLast().op("uuid_ops")),
	index("shareholding_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "shareholding_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "shareholding_fkey_entity"
		}),
	foreignKey({
			columns: [table.shareholerEntityId],
			foreignColumns: [entity.id],
			name: "shareholding_fkey_shareholer_entity"
		}),
	unique("shareholding_unique").on(table.entityId, table.shareholerEntityId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const shareholdingValidity = tenants.table("shareholding_validity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	shareholdingId: uuid("shareholding_id").notNull(),
	startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("shareholding_validity_idx_shareholding").using("btree", table.shareholdingId.asc().nullsLast().op("uuid_ops")),
	index("shareholding_validity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "shareholding_validity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.shareholdingId],
			foreignColumns: [shareholding.id],
			name: "shareholding_validity_fkey_shareholding"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const subsidiary = tenants.table("subsidiary", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	entityId: uuid("entity_id").notNull(),
	parentEntityId: uuid("parent_entity_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index("subsidiary_idx_parent_entity").using("btree", table.parentEntityId.asc().nullsLast().op("uuid_ops")),
	index("subsidiary_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "subsidiary_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "subsidiary_fkey_entity"
		}),
	foreignKey({
			columns: [table.parentEntityId],
			foreignColumns: [entity.id],
			name: "subsidiary_fkey_parent_entity"
		}),
	unique("subsidiary_unique").on(table.entityId, table.parentEntityId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const subsidiaryValidity = tenants.table("subsidiary_validity", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	subsidiaryId: uuid("subsidiary_id").notNull(),
	startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("subsidiary_validity_idx_subsidiary").using("btree", table.subsidiaryId.asc().nullsLast().op("uuid_ops")),
	index("subsidiary_validity_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "subsidiary_validity_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.subsidiaryId],
			foreignColumns: [subsidiary.id],
			name: "subsidiary_validity_fkey_subsidiary"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const branch = tenants.table("branch", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	entityId: uuid("entity_id"),
	parentId: uuid("parent_id"),
	positionId: uuid("position_id"),
	subsidiaryId: uuid("subsidiary_id"),
	isHeadquarters: boolean("is_headquarters").default(false),
	code: varchar({ length: 50 }),
	name: varchar({ length: 250 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("branch_idx_parent").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index("branch_idx_position").using("btree", table.positionId.asc().nullsLast().op("uuid_ops")),
	index("branch_idx_subsidiary").using("btree", table.subsidiaryId.asc().nullsLast().op("uuid_ops")),
	index("branch_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "branch_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.entityId],
			foreignColumns: [entity.id],
			name: "branch_fkey_entity"
		}),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "branch_fkey_parent"
		}),
	foreignKey({
			columns: [table.positionId],
			foreignColumns: [position.id],
			name: "branch_fkey_position"
		}),
	foreignKey({
			columns: [table.subsidiaryId],
			foreignColumns: [subsidiary.id],
			name: "branch_fkey_subsidiary"
		}),
	unique("branch_unique").on(table.code, table.entityId, table.parentId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
	check("branch_ck_parent", sql`((entity_id IS NOT NULL) AND (parent_id IS NULL)) OR ((entity_id IS NULL) AND (parent_id IS NOT NULL))`),
	check("branch_ck_subsidiary", sql`((subsidiary_id IS NULL) AND (annulled_at IS NOT NULL)) OR ((subsidiary_id IS NOT NULL) AND (annulled_at IS NULL))`),
]);

export const identityDocumentByEntityByBranch = tenants.table("identity_document_by_entity_by_branch", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	branchId: uuid("branch_id").notNull(),
	identityDocumentByEntityId: uuid("identity_document_by_entity_id").notNull(),
	description: text(),
	ordering: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("identity_document_by_entity_by_branch_idx_ident_doc_by_ent").using("btree", table.identityDocumentByEntityId.asc().nullsLast().op("uuid_ops")),
	index("identity_document_by_entity_by_branch_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "identity_document_by_entity_by_branch_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.branchId],
			foreignColumns: [branch.id],
			name: "identity_document_by_entity_by_branch_fkey_branch"
		}),
	foreignKey({
			columns: [table.identityDocumentByEntityId],
			foreignColumns: [identityDocumentByEntity.id],
			name: "identity_document_by_entity_by_branch_fkey_ident_doc_by_ent"
		}),
	unique("identity_document_by_entity_by_branch_unique").on(table.branchId, table.identityDocumentByEntityId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const entityAddressByBranch = tenants.table("entity_address_by_branch", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	branchId: uuid("branch_id").notNull(),
	entityAddressId: uuid("entity_address_id").notNull(),
	isPreferred: boolean("is_preferred").default(false).notNull(),
	description: text(),
	ordering: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("entity_address_by_branch_idx_entity_address").using("btree", table.entityAddressId.asc().nullsLast().op("uuid_ops")),
	index("entity_address_by_branch_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "entity_address_by_branch_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.branchId],
			foreignColumns: [branch.id],
			name: "entity_address_by_branch_fkey_branch"
		}),
	foreignKey({
			columns: [table.entityAddressId],
			foreignColumns: [entityAddress.id],
			name: "entity_address_by_branch_fkey_entity_address"
		}),
	unique("entity_address_by_branch_unique").on(table.branchId, table.entityAddressId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const phoneByEntityByBranch = tenants.table("phone_by_entity_by_branch", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	branchId: uuid("branch_id").notNull(),
	phoneByEntityId: uuid("phone_by_entity_id").notNull(),
	description: text(),
	ordering: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("phone_by_entity_by_branch_idx_phone_by_entity").using("btree", table.phoneByEntityId.asc().nullsLast().op("uuid_ops")),
	index("phone_by_entity_by_branch_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "phone_by_entity_by_branch_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.branchId],
			foreignColumns: [branch.id],
			name: "phone_by_entity_by_branch_fkey_branch"
		}),
	foreignKey({
			columns: [table.phoneByEntityId],
			foreignColumns: [phoneByEntity.id],
			name: "phone_by_entity_by_branch_fkey_phone_by_entity"
		}),
	unique("phone_by_entity_by_branch_unique").on(table.branchId, table.phoneByEntityId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const emailByEntityByBranch = tenants.table("email_by_entity_by_branch", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	branchId: uuid("branch_id").notNull(),
	emailByEntityId: uuid("email_by_entity_id").notNull(),
	description: text(),
	ordering: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("email_by_entity_by_branch_idx_email_by_entity").using("btree", table.emailByEntityId.asc().nullsLast().op("uuid_ops")),
	index("email_by_entity_by_branch_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "email_by_entity_by_branch_fkey_system_subscription"
		}),
	foreignKey({
			columns: [table.branchId],
			foreignColumns: [branch.id],
			name: "email_by_entity_by_branch_fkey_branch"
		}),
	foreignKey({
			columns: [table.emailByEntityId],
			foreignColumns: [emailByEntity.id],
			name: "email_by_entity_by_branch_fkey_email_by_entity"
		}),
	unique("email_by_entity_by_branch_unique").on(table.branchId, table.emailByEntityId),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);

export const attachedDocuments = tenants.table("attached_documents", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	systemSubscriptionId: uuid("system_subscription_id").notNull(),
	originTable: varchar("origin_table", { length: 250 }).notNull(),
	originId: uuid("origin_id").notNull(),
	originalName: varchar("original_name", { length: 250 }).notNull(),
	documentName: varchar("document_name", { length: 250 }).notNull(),
	extension: varchar({ length: 20 }).notNull(),
	mimeType: varchar("mime_type", { length: 100 }).notNull(),
	bytesSize: uuid("bytes_size").notNull(),
	storageRoute: varchar("storage_route", { length: 2500 }).notNull(),
	disk: varchar({ length: 50 }).default('local'),
	documentHash: varchar("document_hash", { length: 64 }),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("attached_documents_idx_origin").using("btree", table.originId.asc().nullsLast().op("uuid_ops")),
	index("attached_documents_idx_origin_table").using("btree", table.originTable.asc().nullsLast().op("text_ops")),
	index("attached_documents_idx_system_subscription").using("btree", table.systemSubscriptionId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("attached_documents_uq_idx_document_name").using("btree", table.documentName.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.systemSubscriptionId],
			foreignColumns: [systemSubscription.id],
			name: "attached_documents_fkey_system_subscription"
		}),
	pgPolicy("tenant_isolation", { as: "permissive", for: "all", to: ["public"], using: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`, withCheck: sql`(system_subscription_id = (current_setting('app.current_system_subscription_id'::text))::uuid)`  }),
]);
export const viewEntityMaster = osbs.view("view_entity_master", {	rootId: uuid("root_id"),
	entityId: uuid("entity_id"),
	systemSubscriptionId: uuid("system_subscription_id"),
	isNatural: boolean("is_natural"),
	identityDocument: varchar("identity_document", { length: 250 }),
	name: varchar({ length: 250 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	annulledAt: timestamp("annulled_at", { withTimezone: true, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
}).as(sql`WITH RECURSIVE entity_master AS ( SELECT ent.id AS root_id, ent.id AS entity_id, ent.system_subscription_id, ent.is_natural, ent.identity_document, ent.name, ent.created_at, ent.updated_at, ent.annulled_at, ent.deleted_at FROM tenants.entity ent WHERE ent.fusion_master_entity_id IS NULL AND ent.annulled_at IS NULL UNION ALL SELECT ent.id AS root_id, mas.entity_id, mas.system_subscription_id, mas.is_natural, mas.identity_document, mas.name, mas.created_at, mas.updated_at, mas.annulled_at, mas.deleted_at FROM tenants.entity ent JOIN entity_master mas ON mas.entity_id = ent.fusion_master_entity_id AND mas.annulled_at IS NULL AND ent.annulled_at IS NULL ) SELECT root_id, entity_id, system_subscription_id, is_natural, identity_document, name, created_at, updated_at, annulled_at, deleted_at FROM entity_master`);