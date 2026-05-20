import { defineConfig } from '@mikro-orm/postgresql';
import { EntityGenerator } from '@mikro-orm/entity-generator';
// If using with NestJS, maybe import { MikroOrmModule } from '@mikro-orm/nestjs'; but not needed in config file.

export default defineConfig({
  // Database connection
  host: 'localhost',
  port: 5432,
  user: 'osbs_admin',
  password: '12345678',
  dbName: 'organizational_structure_based_system',

  // Driver (implicitly PostgreSqlDriver from import)
  // entities: specify where to find entity classes
  entities: ['./dist/**/*.entity.js'], // for production build with NestJS, or './src/**/*.entity.ts' with ts-node
  // entitiesTs: ['./src/**/*.entity.ts'], // for development with ts-node

  // Discovery settings
  discovery: {
    // warn if no entities found (default true). Set false if you don't have entities yet.
    warnWhenNoEntities: false,
  },

  // Extensions (required for Entity Generator)
  extensions: [EntityGenerator],

  // Migrations
  migrations: {
    path: './migrations', // folder for migration files (compiled .js)
    pathTs: './migrationsTS', // folder for migration .ts files
    tableName: 'mikro_orm_migrations', // table to track executed migrations
    transactional: true, // wrap each migration in a transaction
    allOrNothing: true, // require all migrations to succeed or none
    // dropTables: true, // allow table dropping in generated migrations
    safe: false, // allow column dropping etc.
    snapshot: true, // create snapshot for faster diffing
    snapshotName: '.snapshot.json', // snapshot file name
  },

  // Debugging and logging
  debug: true, // log SQL queries and other debug info
  logger: console.log.bind(console), // custom logger

  // Pool configuration
  pool: {
    min: 2,
    max: 10,
  },

  // Other common options
  charset: 'utf8mb4',
  // For UUID generation, you can set the strategy, but not needed now.

  // Entity generator specific options (optional, can be passed to generate() directly)
  /* entityGenerator: {
    bidirectionalRelations: true,
    identifiedReferences: true,
    entityDefinition: "entitySchema",
  }, */
});