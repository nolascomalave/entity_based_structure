import { uuid, varchar, timestamp, index, foreignKey, boolean, check, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { osbs } from "src/shared/application/infrastructure/schemas/drizzle-orm/schema";

export const systemSubscription = osbs.table("system_subscription", {
	id: uuid().default(sql`uuidv7()`).primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
});