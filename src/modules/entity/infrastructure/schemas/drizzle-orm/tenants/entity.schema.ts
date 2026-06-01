import { uuid, varchar, timestamp, index, foreignKey, boolean, check, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { tenants } from "src/shared/application/infrastructure/schemas/drizzle-orm/schema";
import { systemSubscription } from "src/modules/system_subscription/infrastructure/schemas/drizzle-orm/osbs/system_subscription.schema";

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