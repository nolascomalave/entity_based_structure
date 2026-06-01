// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  // schema: './src/modules/**/infrastructure/schemas/*.schema.ts', // Apunta a tus esquemas
  schema: './src/modules/**/infrastructure/schemas/drizzle-orm/*.schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Configuración clave: traduce snake_case (DB) a camelCase (TS)
  casing: 'snake_case',
  schemaFilter: ['tenants', 'osbs']
});