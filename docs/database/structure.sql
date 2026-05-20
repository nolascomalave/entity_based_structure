CREATE USER osbs_admin WITH PASSWORD '**************';

-- CREATE DATABASE organizational_structure_based_system WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_United States.1252' LC_CTYPE = 'English_United States.1252';
CREATE DATABASE organizational_structure_based_system WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';

USE organizational_structure_based_system;

CREATE SCHEMA osbs;
CREATE SCHEMA tenants;

CREATE COLLATION unaccent_case_insensitive (
    PROVIDER = icu,
    LOCALE = 'und-u-ks-level1',
    DETERMINISTIC = false
);

CREATE EXTENSION IF NOT EXISTS btree_gist;



CREATE TABLE osbs.region (
	id uuid DEFAULT uuidv7() NOT NULL,
	"name" varchar(100) NOT NULL,
	translations text NULL,
	created_at timestamp NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	flag int2 DEFAULT 1 NOT NULL,
	"wikiDataId" varchar(255) NULL,
	CONSTRAINT region_pkey PRIMARY KEY (id)
);
-- SELECT * FROM osbs.region;

CREATE TABLE osbs.subregion (
	id uuid DEFAULT uuidv7() NOT NULL,
	region_id uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	translations text NULL,
	created_at timestamp NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	flag int2 DEFAULT 1 NOT NULL,
	"wikiDataId" varchar(255) NULL,
	CONSTRAINT subregion_pkey PRIMARY KEY (id),
	CONSTRAINT subregion_region_id_fkey FOREIGN KEY (region_id) REFERENCES osbs.region(id)
);
CREATE INDEX subregion_idx_region ON osbs.subregion USING btree (region_id);
-- SELECT * FROM osbs.subregion;

CREATE TABLE osbs.country (
	id uuid DEFAULT uuidv7() NOT NULL,
	region_id uuid NULL,
	subregion_id uuid NULL,
	region varchar(255) NULL,
	subregion varchar(255) NULL,
	"name" varchar(100) NOT NULL,
	iso3 bpchar(3) NULL,
	numeric_code bpchar(3) NULL,
	iso2 bpchar(2) NULL,
	phonecode varchar(255) NULL,
	capital varchar(255) NULL,
	currency varchar(255) NULL,
	currency_name varchar(255) NULL,
	currency_symbol varchar(255) NULL,
	tld varchar(255) NULL,
	native varchar(255) NULL,
	population int8 NULL,
	gdp int8 NULL,
	nationality varchar(255) NULL,
	area_sq_km float8 NULL,
	postal_code_format varchar(255) NULL,
	postal_code_regex varchar(255) NULL,
	timezones text NULL,
	translations text NULL,
	latitude numeric(10, 8) NULL,
	longitude numeric(11, 8) NULL,
	emoji varchar(191) NULL,
	"emojiU" varchar(191) NULL,
	created_at timestamp NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	flag int2 DEFAULT 1 NOT NULL,
	"wikiDataId" varchar(255) NULL,
	CONSTRAINT country_pkey PRIMARY KEY (id),
	CONSTRAINT country_region_id_fkey FOREIGN KEY (region_id) REFERENCES osbs.region(id),
	CONSTRAINT country_subregion_id_fkey FOREIGN KEY (subregion_id) REFERENCES osbs.subregion(id)
);
CREATE INDEX country_idx_region ON osbs.country USING btree (region_id);
CREATE INDEX country_idx_subregion ON osbs.country USING btree (subregion_id);
-- SELECT * FROM osbs.country;

CREATE TABLE osbs.state (
	id uuid DEFAULT uuidv7() NOT NULL,
	"name" varchar(255) NOT NULL,
	country_id uuid NOT NULL,
	parent_id uuid NULL,
	country_code bpchar(2) NOT NULL,
	fips_code varchar(255) NULL,
	iso2 varchar(255) NULL,
	iso3166_2 varchar(10) NULL,
	"type" varchar(191) NULL,
	"level" int4 NULL,
	native varchar(255) NULL,
	latitude numeric(10, 8) NULL,
	longitude numeric(11, 8) NULL,
	timezone varchar(255) NULL,
	translations text NULL,
	created_at timestamp NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	flag int2 DEFAULT 1 NOT NULL,
	"wikiDataId" varchar(255) NULL,
	population varchar(255) NULL,
	CONSTRAINT state_pkey PRIMARY KEY (id),
	CONSTRAINT state_country_id_fkey FOREIGN KEY (country_id) REFERENCES osbs.country(id)
);
CREATE INDEX state_idx_country ON osbs.state USING btree (country_id);
-- SELECT * FROM osbs.state;

CREATE TABLE osbs.city (
	id uuid DEFAULT uuidv7() NOT NULL,
	"name" varchar(255) NOT NULL,
	state_id uuid NOT NULL,
	country_id uuid NOT NULL,
	parent_id uuid NULL,
	state_code varchar(255) NOT NULL,
	country_code bpchar(2) NOT NULL,
	"type" varchar(191) NULL,
	"level" int4 NULL,
	latitude numeric(10, 8) NOT NULL,
	longitude numeric(11, 8) NOT NULL,
	native varchar(255) NULL,
	population int8 NULL,
	timezone varchar(255) NULL,
	translations text NULL,
	created_at timestamp DEFAULT '2014-01-01 12:01:01'::timestamp without time zone NOT NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	flag int2 DEFAULT 1 NOT NULL,
	"wikiDataId" varchar(255) NULL,
	CONSTRAINT city_pkey PRIMARY KEY (id),
	CONSTRAINT city_country_id_fkey FOREIGN KEY (country_id) REFERENCES osbs.country(id),
	CONSTRAINT city_state_id_fkey FOREIGN KEY (state_id) REFERENCES osbs.state(id)
);
CREATE INDEX city_idx_country ON osbs.city USING btree (country_id);
CREATE INDEX city_idx_state ON osbs.city USING btree (state_id);
-- SELECT COUNT(*) FROM osbs.city;




-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Creating Tables: ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Tablas maestras (Esquema maestro): -------------------------------
CREATE TABLE osbs.audit_log (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  record_id UUID NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  action VARCHAR(10) NOT NULL,
  old_data JSONB,
  new_data JSONB NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE osbs.system_subscription (
  id UUID PRIMARY KEY DEFAULT uuidv7(),

  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE osbs.system_subscription_validity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE osbs.system_client (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  name VARCHAR(250) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE osbs.phone (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  country_id UUID NOT NULL, -- ref: > osbs.country.id
  state_id UUID, -- [ref: > osbs.state.id]
  phone VARCHAR(50) NOT NULL,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE osbs.email (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  email VARCHAR(320) NOT NULL,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);



-- Tablas de la lógica de negocio (Esquema de tenants): -------------
CREATE TABLE tenants.audit_log (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  user_access_id UUID, -- [ref: > tenants.user_access.id]
  session_id UUID, -- [ref: > tenants.session.id]
  record_id UUID NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  action VARCHAR(10) NOT NULL,
  old_data JSONB,
  new_data JSONB NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenants.system_subscription_owner (
  -- id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID PRIMARY KEY, -- ref: > osbs.system_subscription.id
  entity_id UUID NOT NULL -- [not null, ref: > tenants.entity.id]
);

CREATE TABLE tenants.system_subscription_client (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  system_client_id UUID, -- [ref: > osbs.system_client.id]
  name VARCHAR(250) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.user_access (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  system_subscription_client_id UUID NOT NULL, -- ref: > tenants.system_subscription_client.id
  email_by_entity_id UUID NOT NULL, -- ref: > osbs.email_by_entity.id
  password TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

/* Table tenants.password_history (
  id uuidv7 [pk, unique, not null]
) */

CREATE TABLE tenants.user_access_validity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  user_access_id UUID NOT NULL, -- ref: > tenants.user_access.id
  start_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMPTZ
);

CREATE TABLE tenants.session (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  user_access_id UUID, -- ref: > tenants.user_access.id
  refreshToken TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.recovery_password (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  user_access_id UUID, -- ref: > tenants.user_access.id
  validity_code VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  used_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.recovery_password_notify (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id]
  recovery_password_id UUID NOT NULL, -- ref: > tenants.recovery_password.id]
  phone_by_entity_id UUID, -- [ref: > tenants.phone_by_entity.id]
  email_by_entity_id UUID, -- [ref: > tenants.email_by_entity.id]
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.entity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  fusion_master_entity_id UUID, -- ref: > tenants.entity.id
  is_natural BOOLEAN NOT NULL DEFAULT false,
  identity_document VARCHAR(250),
  name VARCHAR(250),

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fusioned_at TIMESTAMPTZ,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.natural_entity_gender (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  gender VARCHAR(100) NOT NULL,
  description VARCHAR(2500),

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.natural_entity (
  entity_id UUID PRIMARY KEY, -- ref: - tenants.entity.id
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  natural_entity_gender_id UUID NOT NULL, -- ref: > tenants.natural_entity_gender.id
  birth_date DATE,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.identity_document_category (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  parent_id UUID NOT NULL, -- ref: > tenants.identity_document_category.id
  region_id UUID, -- ref: > osbs.region.id
  subregion_id UUID, -- ref: > osbs.subregion.id
  country_id UUID, -- ref: > osbs.country.id
  state_id UUID, -- ref: > osbs.state.id
  city_id UUID, -- ref: > osbs.city.id
  apply_to_natural BOOLEAN NOT NULL DEFAULT TRUE,
  apply_to_legal BOOLEAN NOT NULL DEFAULT TRUE,
  category VARCHAR(250) NOT NULL,
  symbol VARCHAR(50),
  abbreviation VARCHAR(50),

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.identity_document (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  identity_document_category_id UUID NOT NULL, -- ref: > tenants.identity_document_category.id
  document VARCHAR(250) NOT NULL,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.identity_document_by_entity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  entity_id UUID NOT NULL, -- ref: > tenants.entity.id
  identity_document_id UUID NOT NULL, -- ref: > tenants.identity_document.id
  description TEXT,
  ordering BIGINT NOT NULL DEFAULT 0,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.entity_name_type (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  type VARCHAR(50) NOT NULL,
  apply_to_natural BOOLEAN NOT NULL DEFAULT TRUE,
  apply_to_legal BOOLEAN NOT NULL DEFAULT TRUE,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.entity_name (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  name VARCHAR(250) NOT NULL,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.entity_name_by_entity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  entity_id UUID NOT NULL, -- ref: > tenants.entity.id
  entity_name_id UUID NOT NULL, -- ref: > tenants.entity_name.id
  entity_name_type_id UUID NOT NULL, -- ref: > tenants.entity_name_type.id
  ordering_by_type INT NOT NULL DEFAULT 0,
  description TEXT,
  ordering INT NOT NULL DEFAULT 0,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.entity_address (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  entity_id UUID NOT NULL, -- ref: > tenants.entity.id
  region_id UUID, -- ref: > osbs.region.id
  subregion_id UUID, -- ref: > osbs.subregion.id
  country_id UUID NOT NULL, -- ref: > osbs.country.id
  state_id UUID NOT NULL, -- ref: > osbs.state.id
  city_id UUID, -- ref: > osbs.city.id
  postal_code INT,
  custom_city VARCHAR(250),
  description TEXT,
  is_preferred BOOLEAN NOT NULL DEFAULT FALSE,
  ordering INT NOT NULL DEFAULT 0,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.phone_by_entity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  phone_id UUID NOT NULL, -- ref: > osbs.phone.id
  entity_id UUID NOT NULL, -- ref: > tenants.entity.id
  preferred BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  ordering INT NOT NULL DEFAULT 0,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.email_by_entity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id]
  email_id UUID NOT NULL, -- ref: > osbs.email.id]
  entity_id UUID NOT NULL, -- ref: > tenants.entity.id]
  preferred BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  ordering INT NOT NULL DEFAULT 0,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- ===============================================
-- Departamento (jerárquico, por entidad jurídica)
-- ===============================================
CREATE TABLE tenants.department (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id]
  entity_id UUID, -- ref: > tenants.entity.id, note: "Must be null if parent_id fiel is not null. If parent_id field is null, this field must be not null." // entidad jurídica dueña del departamento
  parent_id UUID, -- ref: > tenants.department.id, note: "Must be null if entity_id fiel is not null. If entity_id field is null, this field must be not null." // jerarquía (null = raíz)
  name VARCHAR(250) NOT NULL,
  description TEXT,
  code VARCHAR(50), -- opcional: código de departamento
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- ==============================================
-- Familia de Cargos (Job Family)
-- ==============================================
CREATE TABLE tenants.job_family (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  entity_id UUID NOT NULL, -- ref: > tenants.entity.id
  name VARCHAR(250) NOT NULL,
  description TEXT,

  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- ====================================================
-- Cargo (Position) – jerárquico (reporta a otro cargo)
-- ====================================================
CREATE TABLE tenants.position (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  entity_id UUID, -- ref: > tenants.entity.id, note: "Must be null if parent_id fiel is not null. If parent_id field is null, this field must be not null." -- entidad jurídica dueña del departamento
  parent_id UUID, -- ref: > tenants.department.id, note: "Must be null if entity_id fiel is not null. If entity_id field is null, this field must be not null." -- jerarquía (null = raíz)
  job_family_id UUID, -- ref: > tenants.job_family.id -- opcional, puede no tener familia
  department_id UUID, -- ref: > tenants.department.id -- departamento al que pertenece
  name VARCHAR(250) NOT NULL,
  description TEXT,

  -- Nivel jerárquico (opcional, para facilitar consultas)
  -- level int

  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- ==========================================================================
-- Empleado (relaciona persona natural como empleado de una entidad jurídica)
-- ==========================================================================
CREATE TABLE tenants.employee (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  person_entity_id UUID NOT NULL, -- ref: > tenants.entity.id -- la persona (is_natural = true)
  legal_entity_id UUID NOT NULL, -- ref: > tenants.entity.id -- empresa donde trabaja (is_natural = false)
  employee_code VARCHAR(100) NOT NULL, -- código interno
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- =====================================================================================================
-- Vigencia del empleado (establece las fechas de inicio y fin de periodos de un empleado en la empresa)
-- =====================================================================================================
CREATE TABLE tenants.employee_validity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  employee_id UUID NOT NULL, -- ref: > tenants.employee.id
  start_date TIMESTAMPTZ NOT NULL, -- note: "The value of this field must not be between the start_date and end_date of another record of same employee."
  end_date TIMESTAMPTZ, -- [note: "Must not exists 2 records for 1 employee with this field with null value."]

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- Empleado por Cargo (relaciona empleado con un cargo de una entidad jurídica)
-- ============================================================================
CREATE TABLE tenants.employee_per_position (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  employee_id UUID NOT NULL, -- ref: > tenants.employee.id
  position_id UUID NOT NULL, -- ref: > tenants.position.id, note: "Must not exists 2 or more records with same position_id and is_active value in \"true\""
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Vigencia de Empleado por Cargo (Historial de vigencia de empleado por cargo)
-- ============================================================================
CREATE TABLE tenants.employee_per_position_validity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  employee_per_position_id UUID NOT NULL, -- ref: > tenants.employee_per_position.id
  start_date TIMESTAMPTZ, -- [not null, note: "The value of this field must not be between the start_date and end_date of another record of same employee."]
  end_date TIMESTAMPTZ, -- [note: "Must not exists 2 records for 1 employee with this field with null value."]

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- ================================================================================================================
-- Participación accionaria (participación accionaria de una entidad natural o jurídica sobre una entidad jurídica)
-- ================================================================================================================
CREATE TABLE tenants.shareholding (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  entity_id UUID NOT NULL, -- ref: > tenants.entity.id] -- entidad jurídica que tiene accionistas.
  shareholer_entity_id UUID NOT NULL, -- ref: > tenants.entity.id] -- accionista (puede ser natural o jurídica)
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  ownership_percentage DECIMAL(5,2), -- porcentaje de participación
  shares_quantity INT, -- cantidad de acciones (opcional)
  -- share_class VARCHAR(50) -- clase de acción (ej: A, B, preferente)

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- ==========================================================================================================================
-- Vigencia de la Participación accionaria (establece las fechas de inicio y fin de periodos de una participación accionaria)
-- ==========================================================================================================================
CREATE TABLE tenants.shareholding_validity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  shareholding_id UUID NOT NULL, -- ref: > tenants.shareholding.id
  start_date TIMESTAMPTZ NOT NULL, -- note: "The value of this field must not be between the start_date and end_date of another record of same employee."
  end_date TIMESTAMPTZ, -- note: "Must not exists 2 records for 1 employee with this field with null value."

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- ==============================================
-- Subsidiaria (relación matriz -> filial)
-- ==============================================
CREATE TABLE tenants.subsidiary (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  entity_id UUID NOT NULL, -- ref: > tenants.entity.id // entidad filial (is_natural = false)
  parent_entity_id UUID NOT NULL, -- ref: > tenants.entity.id // entidad matriz (is_natural = false)

  -- Auditoría
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================================================================================
-- Vigencia de la Participación accionaria (establece las fechas de inicio y fin de periodos de una participación accionaria)
-- ==========================================================================================================================
CREATE TABLE tenants.subsidiary_validity (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  subsidiary_id UUID NOT NULL, -- ref: > tenants.subsidiary.id
  start_date TIMESTAMPTZ NOT NULL, -- note: "The value of this field must not be between the start_date and end_date of another record of same employee."
  end_date TIMESTAMPTZ, -- note: "Must not exists 2 records for 1 employee with this field with null value."

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- ==============================================
-- Rama (relación matriz -> rama - sucursal)
-- ==============================================
CREATE TABLE tenants.branch (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  entity_id UUID, -- ref: > tenants.entity.id, note: "This field can be null when parent_id field is not null, else this field must be not null."  // entidad jurídica dueña de la sucursal
  parent_id UUID, -- ref: > tenants.branch.id, note: "This field can be null when entity_id field is not null, else this field must be not null."  // rama padre de la sucursal
  position_id UUID, -- ref: > tenants.position.id  // cargo encargado de la sucursal
  subsidiary_id UUID, -- ref: > tenants.subsidiary.id // Si este campo apunta a una subsidiaria, entonces los campos "annulled_by_session_id" e "annulled_at" deben tener valor.
  is_headquarters BOOLEAN DEFAULT FALSE, -- si es la casa matriz
  code VARCHAR(50), -- código interno
  name VARCHAR(250), -- "Sucursal Norte", "Oficina Madrid"
  /* address TEXT,
  city VARCHAR(100)
  country VARCHAR(100)
  phone VARCHAR(50) */

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.identity_document_by_entity_by_branch (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  branch_id UUID NOT NULL, -- ref: > tenants.branch.id
  identity_document_by_entity_id UUID NOT NULL, -- ref: > tenants.identity_document_by_entity.id
  description TEXT,
  ordering INT NOT NULL DEFAULT 0,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.entity_address_by_branch (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  branch_id UUID NOT NULL, -- ref: > tenants.branch.id
  entity_address_id UUID NOT NULL, -- ref: > tenants.entity_address.id
  is_preferred BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  ordering INT NOT NULL DEFAULT 0,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.phone_by_entity_by_branch (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  branch_id UUID NOT NULL, -- ref: > tenants.branch.id
  phone_by_entity_id UUID NOT NULL, -- ref: > tenants.phone_by_entity.id
  description TEXT,
  ordering INT NOT NULL DEFAULT 0,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.email_by_entity_by_branch (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  branch_id UUID NOT NULL, -- ref: > tenants.branch.id
  email_by_entity_id UUID NOT NULL, -- ref: > tenants.email_by_entity.id
  description TEXT,
  ordering INT NOT NULL DEFAULT 0,

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE tenants.attached_documents (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  system_subscription_id UUID NOT NULL, -- ref: > osbs.system_subscription.id
  origin_table VARCHAR(250) NOT NULL,
  origin_id UUID NOT NULL,
  original_name VARCHAR(250) NOT NULL,
  document_name VARCHAR(250) NOT NULL,
  extension VARCHAR(20) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  bytes_size UUID NOT NULL,
  storage_route VARCHAR(2500) NOT NULL,
  disk VARCHAR(50) DEFAULT 'local',
  document_hash VARCHAR(64),
  description TEXT,
  -- tags TEXT[] []

  -- Campos de registro de acción:
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  annulled_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);


-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Creating Comments on columns: ---------------------------------------------------------------------------------------------------------------------------------------------------------------
-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
COMMENT ON COLUMN osbs.audit_log.record_id IS 'Is the pointer of the related record.';
COMMENT ON COLUMN osbs.audit_log.table_name IS 'Is the name of table where exists the related record pointered by record_id field.';
COMMENT ON COLUMN osbs.audit_log.action IS 'The made action: Create, Update, Soft Delete, Delete.';
COMMENT ON COLUMN tenants.audit_log.action IS 'The made action: Create, Update, Soft Delete, Delete.';
COMMENT ON COLUMN tenants.system_subscription_client.system_client_id IS 'Can be null if is not a official system client for this backend system.';
COMMENT ON COLUMN tenants.entity.fusion_master_entity_id IS 'This foreign key references the entity that is being fused.';
COMMENT ON COLUMN tenants.department.entity_id IS 'Must be null if parent_id fiel is not null. If parent_id field is null, this field must be not null.';
COMMENT ON COLUMN tenants.department.parent_id IS 'Must be null if entity_id fiel is not null. If entity_id field is null, this field must be not null.';
COMMENT ON COLUMN tenants.position.entity_id IS 'Must be null if parent_id fiel is not null. If parent_id field is null, this field must be not null.';
COMMENT ON COLUMN tenants.position.parent_id IS 'Must be null if entity_id fiel is not null. If entity_id field is null, this field must be not null.';
COMMENT ON COLUMN tenants.employee.person_entity_id IS 'The entity must be natural.';
COMMENT ON COLUMN tenants.employee.legal_entity_id IS 'Company where the employee work. This entity_id must point at legal entity.';
COMMENT ON COLUMN tenants.employee_validity.start_date IS 'The value of this field must not be between the start_date and end_date of another record of same employee.';
COMMENT ON COLUMN tenants.employee_validity.end_date IS 'Must not exists 2 records for 1 employee with this field with null value.';
COMMENT ON COLUMN tenants.employee_per_position.position_id IS 'Must not exists 2 or more records with same position_id and is_active value in \"true\"';
COMMENT ON COLUMN tenants.shareholding.entity_id IS 'This is the company. Must be legal entity.';
COMMENT ON COLUMN tenants.shareholding.shareholer_entity_id IS 'This is the shareholder.';
COMMENT ON COLUMN tenants.branch.entity_id IS 'Is the legal entity owner of the brach. This field can be null when parent_id field is not null, else this field must be not null.';
COMMENT ON COLUMN tenants.branch.parent_id IS 'This field can be null when entity_id field is not null, else this field must be not null.';
COMMENT ON COLUMN tenants.branch.position_id IS 'Position of branch responsible.';
COMMENT ON COLUMN tenants.branch.subsidiary_id IS 'If this point to a subsidiary, then the field annulled_at must not be null.';


-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Creating Indexes: ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Unique Indexes:
CREATE UNIQUE INDEX system_client_uq_idx_name ON osbs.system_client (name);
CREATE UNIQUE INDEX phone_uq_idx_phone ON osbs.phone (phone);
CREATE UNIQUE INDEX email_uq_idx_email ON osbs.email (email);
CREATE UNIQUE INDEX employee_per_position_uq_idx_active_position ON tenants.employee_per_position (position_id) WHERE is_active = true;
CREATE UNIQUE INDEX attached_documents_uq_idx_document_name ON tenants.attached_documents (document_name);

-- Common Indexes:
CREATE INDEX audit_log_idx_table_table_record ON osbs.audit_log(table_name, record_id);
CREATE INDEX audit_log_idx_table_record ON osbs.audit_log(record_id);
CREATE INDEX system_subscription_validity_idx_system_subscription ON osbs.system_subscription_validity(system_subscription_id);
CREATE INDEX phone_idx_state ON osbs.phone(state_id);
CREATE INDEX audit_log_idx_system_subscription ON tenants.audit_log(system_subscription_id);
CREATE INDEX audit_log_idx_table_record ON tenants.audit_log(table_name, record_id);
CREATE INDEX audit_log_idx_record ON tenants.audit_log(record_id);
CREATE INDEX audit_log_idx_user_access ON tenants.audit_log(user_access_id);
CREATE INDEX audit_log_idx_session ON tenants.audit_log(session_id);
-- CREATE INDEX system_subscription_owner_idx_system_subscription ON tenants.system_subscription_owner(system_subscription_id);
CREATE INDEX system_subscription_owner_idx_entity ON tenants.system_subscription_owner(entity_id);
-- CREATE INDEX system_subscription_client_idx_system_subscription ON tenants.system_subscription_client(system_subscription_id);
CREATE INDEX system_subscription_client_idx_system_client ON tenants.system_subscription_client(system_client_id);
CREATE INDEX user_access_idx_system_subscription ON tenants.user_access(system_subscription_id);
CREATE INDEX user_access_idx_email_by_entity ON tenants.user_access(email_by_entity_id);
CREATE INDEX user_access_validity_idx_system_subscription ON tenants.user_access_validity(system_subscription_id);
CREATE INDEX user_access_validity_idx_user_access ON tenants.user_access_validity(user_access_id);
CREATE INDEX session_idx_system_subscription ON tenants.session(system_subscription_id);
CREATE INDEX session_idx_user_access ON tenants.session(user_access_id);
CREATE INDEX recovery_password_idx_system_subscription ON tenants.recovery_password(system_subscription_id);
CREATE INDEX recovery_password_idx_user_access ON tenants.recovery_password(user_access_id);
CREATE INDEX recovery_password_notify_idx_system_subscription ON tenants.recovery_password_notify(system_subscription_id);
CREATE INDEX recovery_password_notify_idx_recovery_password ON tenants.recovery_password_notify(recovery_password_id);
CREATE INDEX recovery_password_notify_idx_phone_by_entity ON tenants.phone_by_entity(id);
CREATE INDEX recovery_password_notify_idx_email_by_entity ON tenants.email_by_entity(id);
CREATE INDEX entity_idx_system_subscription ON tenants.entity(system_subscription_id);
CREATE INDEX entity_idx_fusion_master_entity ON tenants.entity(fusion_master_entity_id);
-- CREATE INDEX natural_entity_gender_idx_system_subscription ON tenants.natural_entity_gender(system_subscription_id);
CREATE INDEX natural_entity_idx_system_subscription ON tenants.natural_entity(system_subscription_id);
CREATE INDEX natural_entity_idx_natural_entity_gender ON tenants.natural_entity(natural_entity_gender_id);
CREATE INDEX identity_document_category_idx_parent ON tenants.identity_document_category(parent_id);
CREATE INDEX identity_document_category_idx_region ON tenants.identity_document_category(region_id);
CREATE INDEX identity_document_category_idx_subregion ON tenants.identity_document_category(subregion_id);
CREATE INDEX identity_document_category_idx_country ON tenants.identity_document_category(country_id);
CREATE INDEX identity_document_category_idx_state ON tenants.identity_document_category(state_id);
CREATE INDEX identity_document_category_idx_city ON tenants.identity_document_category(city_id);
CREATE INDEX identity_document_idx_system_subscription ON tenants.identity_document(system_subscription_id);
-- CREATE INDEX identity_document_idx_document ON tenants.identity_document(document);
CREATE INDEX identity_document_by_entity_idx_system_subscription ON tenants.identity_document_by_entity(system_subscription_id);
CREATE INDEX identity_document_by_entity_idx_identity_document ON tenants.identity_document_by_entity(identity_document_id);
CREATE INDEX entity_name_by_entity_idx_system_subscription ON tenants.entity_name_by_entity(system_subscription_id);
-- CREATE INDEX entity_name_by_entity_idx_entity ON tenants.entity_name_by_entity(entity_id);
CREATE INDEX entity_name_by_entity_idx_entity_name ON tenants.entity_name_by_entity(entity_name_id);
CREATE INDEX entity_name_by_entity_idx_entity_name_type ON tenants.entity_name_by_entity(entity_name_type_id);
CREATE INDEX entity_address_idx_system_subscription ON tenants.entity_address(system_subscription_id);
-- CREATE INDEX entity_address_idx_region ON osbs.region(system_subscription_id);
-- CREATE INDEX entity_address_idx_subregion ON osbs.subregion(system_subscription_id);
-- CREATE INDEX entity_address_idx_country ON osbs.country(system_subscription_id);
-- CREATE INDEX entity_address_idx_state ON osbs.state(system_subscription_id);
-- CREATE INDEX entity_address_idx_city ON osbs.city(system_subscription_id);
CREATE INDEX phone_by_entity_idx_system_subscription ON tenants.phone_by_entity(system_subscription_id);
CREATE INDEX phone_by_entity_idx_entity ON tenants.phone_by_entity(entity_id);
CREATE INDEX email_by_entity_idx_system_subscription ON tenants.email_by_entity(system_subscription_id);
CREATE INDEX email_by_entity_idx_entity ON tenants.email_by_entity(entity_id);
CREATE INDEX department_idx_system_subscription ON tenants.department(system_subscription_id);
CREATE INDEX department_idx_parent ON tenants.department(parent_id);
CREATE INDEX job_family_idx_system_subscription ON tenants.job_family(system_subscription_id);
CREATE INDEX position_idx_system_subscription ON tenants.position(system_subscription_id);
CREATE INDEX position_idx_parent ON tenants.position(parent_id);
CREATE INDEX position_idx_job_family ON tenants.position(job_family_id);
CREATE INDEX position_idx_department ON tenants.position(department_id);
CREATE INDEX employee_idx_system_subscription ON tenants.employee(system_subscription_id);
CREATE INDEX employee_validity_idx_system_subscription ON tenants.employee_validity(system_subscription_id);
CREATE INDEX employee_validity_idx_employee ON tenants.employee_validity(employee_id);
CREATE INDEX employee_per_position_idx_system_subscription ON tenants.employee_per_position(system_subscription_id);
-- CREATE INDEX employee_per_position_idx_employee ON tenants.employee_per_position(employee_id);
CREATE INDEX employee_per_position_idx_position ON tenants.employee_per_position(position_id);
CREATE INDEX employee_per_position_validity_idx_system_subscription ON tenants.employee_per_position_validity(system_subscription_id);
CREATE INDEX employee_per_position_validity_idx_employee_per_position ON tenants.employee_per_position_validity(employee_per_position_id);
CREATE INDEX shareholding_idx_system_subscription ON tenants.shareholding(system_subscription_id);
CREATE INDEX shareholding_idx_shareholer_entity ON tenants.shareholding(shareholer_entity_id);
CREATE INDEX shareholding_validity_idx_system_subscription ON tenants.shareholding_validity(system_subscription_id);
CREATE INDEX shareholding_validity_idx_shareholding ON tenants.shareholding_validity(shareholding_id);
CREATE INDEX subsidiary_idx_system_subscription ON tenants.subsidiary(system_subscription_id);
CREATE INDEX subsidiary_idx_parent_entity ON tenants.subsidiary(parent_entity_id);
CREATE INDEX subsidiary_validity_idx_system_subscription ON tenants.subsidiary_validity(system_subscription_id);
CREATE INDEX subsidiary_validity_idx_subsidiary ON tenants.subsidiary_validity(subsidiary_id);
CREATE INDEX branch_idx_system_subscription ON tenants.branch(system_subscription_id);
CREATE INDEX branch_idx_parent ON tenants.branch(parent_id);
CREATE INDEX branch_idx_position ON tenants.branch(position_id);
CREATE INDEX branch_idx_subsidiary ON tenants.branch(subsidiary_id);
CREATE INDEX identity_document_by_entity_by_branch_idx_system_subscription ON tenants.identity_document_by_entity_by_branch(system_subscription_id);
CREATE INDEX identity_document_by_entity_by_branch_idx_ident_doc_by_ent ON tenants.identity_document_by_entity_by_branch(identity_document_by_entity_id);
CREATE INDEX entity_address_by_branch_idx_system_subscription ON tenants.entity_address_by_branch(system_subscription_id);
CREATE INDEX entity_address_by_branch_idx_entity_address ON tenants.entity_address_by_branch(entity_address_id);
CREATE INDEX phone_by_entity_by_branch_idx_system_subscription ON tenants.phone_by_entity_by_branch(system_subscription_id);
CREATE INDEX phone_by_entity_by_branch_idx_phone_by_entity ON tenants.phone_by_entity_by_branch(phone_by_entity_id);
CREATE INDEX email_by_entity_by_branch_idx_system_subscription ON tenants.email_by_entity_by_branch(system_subscription_id);
CREATE INDEX email_by_entity_by_branch_idx_email_by_entity ON tenants.email_by_entity_by_branch(email_by_entity_id);
CREATE INDEX attached_documents_idx_system_subscription ON tenants.attached_documents(system_subscription_id);
CREATE INDEX attached_documents_idx_origin_table ON tenants.attached_documents(origin_table);
CREATE INDEX attached_documents_idx_origin ON tenants.attached_documents(origin_id);


-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Creating Unique Constraints: ----------------------------------------------------------------------------------------------------------------------------------------------------------------
-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ALTER TABLE osbs.phone ADD CONSTRAINT phone_unique UNIQUE (country_id, state_id, phone);
ALTER TABLE tenants.system_subscription_client ADD CONSTRAINT system_subscription_client_unique UNIQUE (system_subscription_id, name);
ALTER TABLE tenants.user_access ADD CONSTRAINT user_access_unique UNIQUE (system_subscription_client_id, email_by_entity_id);
ALTER TABLE tenants.natural_entity_gender ADD CONSTRAINT natural_entity_gender_unique UNIQUE (system_subscription_id, gender);
ALTER TABLE tenants.identity_document_category ADD CONSTRAINT identity_document_category_unique UNIQUE (system_subscription_id, parent_id, region_id, subregion_id, country_id, state_id, city_id);
ALTER TABLE tenants.identity_document ADD CONSTRAINT identity_document_unique UNIQUE (identity_document_category_id, document);
ALTER TABLE tenants.identity_document_by_entity ADD CONSTRAINT identity_document_by_entity_unique UNIQUE (entity_id, identity_document_id);
ALTER TABLE tenants.entity_name_type ADD CONSTRAINT entity_name_type_unique UNIQUE (system_subscription_id, type);
ALTER TABLE tenants.entity_name ADD CONSTRAINT entity_name_unique UNIQUE (system_subscription_id, name);
ALTER TABLE tenants.entity_name_by_entity ADD CONSTRAINT entity_name_by_entity_unique UNIQUE (entity_id, entity_name_id, entity_name_type_id);
ALTER TABLE tenants.entity_address ADD CONSTRAINT entity_address_unique UNIQUE (entity_id, region_id, subregion_id, country_id, state_id, city_id, postal_code, custom_city);
ALTER TABLE tenants.phone_by_entity ADD CONSTRAINT phone_by_entity_unique UNIQUE (phone_id, entity_id);
ALTER TABLE tenants.email_by_entity ADD CONSTRAINT email_by_entity_unique UNIQUE (email_id, entity_id);
ALTER TABLE tenants.department ADD CONSTRAINT department_unique UNIQUE (entity_id, parent_id, name);
ALTER TABLE tenants.job_family ADD CONSTRAINT job_family_unique UNIQUE (entity_id, name);
ALTER TABLE tenants.position ADD CONSTRAINT position_unique UNIQUE (entity_id, parent_id, job_family_id, department_id, name);
ALTER TABLE tenants.employee ADD CONSTRAINT employee_unique_person UNIQUE (person_entity_id, legal_entity_id);
ALTER TABLE tenants.employee ADD CONSTRAINT employee_unique_code UNIQUE (legal_entity_id, employee_code);
ALTER TABLE tenants.employee_per_position ADD CONSTRAINT employee_per_position_unique UNIQUE (employee_id, position_id);
ALTER TABLE tenants.shareholding ADD CONSTRAINT shareholding_unique UNIQUE (entity_id, shareholer_entity_id);
ALTER TABLE tenants.subsidiary ADD CONSTRAINT subsidiary_unique UNIQUE (entity_id, parent_entity_id);
ALTER TABLE tenants.branch ADD CONSTRAINT branch_unique UNIQUE (entity_id, parent_id, code);
ALTER TABLE tenants.identity_document_by_entity_by_branch ADD CONSTRAINT identity_document_by_entity_by_branch_unique UNIQUE (branch_id, identity_document_by_entity_id);
ALTER TABLE tenants.entity_address_by_branch ADD CONSTRAINT entity_address_by_branch_unique UNIQUE (branch_id, entity_address_id);
ALTER TABLE tenants.phone_by_entity_by_branch ADD CONSTRAINT phone_by_entity_by_branch_unique UNIQUE (branch_id, phone_by_entity_id);
ALTER TABLE tenants.email_by_entity_by_branch ADD CONSTRAINT email_by_entity_by_branch_unique UNIQUE (branch_id, email_by_entity_id);


-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Creating Checks: ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ALTER TABLE osbs.email ADD CONSTRAINT email_ck_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE tenants.recovery_password_notify ADD CONSTRAINT recovery_password_notify_ck_notify_method CHECK (phone_by_entity_id IS NOT NULL OR email_by_entity_id IS NOT NULL);
ALTER TABLE tenants.entity ADD CONSTRAINT entity_ck_fusion CHECK ((fusion_master_entity_id IS NOT NULL AND fusioned_at IS NOT NULL) OR (fusion_master_entity_id IS NULL AND fusioned_at IS NULL));
ALTER TABLE tenants.identity_document_category ADD CONSTRAINT identity_document_category_ck_apply_to CHECK (apply_to_natural = TRUE OR apply_to_legal = TRUE);
ALTER TABLE tenants.department ADD CONSTRAINT department_ck_fusion CHECK ((entity_id IS NOT NULL AND parent_id IS NULL) OR (entity_id IS NULL AND parent_id IS NOT NULL));
ALTER TABLE tenants.branch ADD CONSTRAINT branch_ck_parent CHECK ((entity_id IS NOT NULL AND parent_id IS NULL) OR (entity_id IS NULL AND parent_id IS NOT NULL));
ALTER TABLE tenants.branch ADD CONSTRAINT branch_ck_subsidiary CHECK ((subsidiary_id IS NULL AND annulled_at IS NOT NULL) OR (subsidiary_id IS NOT NULL AND annulled_at IS NULL));


-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Creating Date Interval Constraints: ---------------------------------------------------------------------------------------------------------------------------------------------------------
-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ALTER TABLE osbs.system_subscription_validity
  ADD CONSTRAINT system_subscription_validity_uq_no_overlap
  EXCLUDE USING GIST (
    system_subscription_id WITH =,
    tstzrange(start_date, end_date, '[)') WITH &&
  );
ALTER TABLE tenants.employee_validity
  ADD CONSTRAINT employee_validity_uq_no_overlap
  EXCLUDE USING GIST (
    employee_id WITH =,
    tstzrange(start_date, end_date, '[)') WITH &&
  );
ALTER TABLE tenants.employee_per_position_validity
  ADD CONSTRAINT employee_per_position_validity_uq_no_overlap
  EXCLUDE USING GIST (
    employee_per_position_id WITH =,
    tstzrange(start_date, end_date, '[)') WITH &&
  );
ALTER TABLE tenants.shareholding_validity
  ADD CONSTRAINT shareholding_validity_uq_no_overlap
  EXCLUDE USING GIST (
    shareholding_id WITH =,
    tstzrange(start_date, end_date, '[)') WITH &&
  );
ALTER TABLE tenants.subsidiary_validity
  ADD CONSTRAINT subsidiary_validity_uq_no_overlap
  EXCLUDE USING GIST (
    subsidiary_id WITH =,
    tstzrange(start_date, end_date, '[)') WITH &&
  );


-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Foreign Keys: -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
ALTER TABLE ONLY osbs.system_subscription_validity ADD CONSTRAINT system_subscription_validity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE ONLY osbs.phone ADD CONSTRAINT phone_fkey_country FOREIGN KEY (country_id) REFERENCES osbs.country(id);
ALTER TABLE ONLY osbs.phone ADD CONSTRAINT phone_fkey_state FOREIGN KEY (state_id) REFERENCES osbs.state(id);
ALTER TABLE tenants.audit_log ADD CONSTRAINT audit_log_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.audit_log ADD CONSTRAINT audit_log_fkey_user_access FOREIGN KEY (user_access_id) REFERENCES tenants.user_access(id);
ALTER TABLE tenants.audit_log ADD CONSTRAINT audit_log_fkey_session FOREIGN KEY (session_id) REFERENCES tenants.session(id) ON DELETE SET NULL;
ALTER TABLE tenants.system_subscription_owner ADD CONSTRAINT system_subscription_owner_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.system_subscription_owner ADD CONSTRAINT system_subscription_owner_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.system_subscription_client ADD CONSTRAINT system_subscription_client_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.system_subscription_client ADD CONSTRAINT system_subscription_client_fkey_system_client FOREIGN KEY (system_client_id) REFERENCES osbs.system_client(id);
ALTER TABLE tenants.user_access ADD CONSTRAINT user_access_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.user_access ADD CONSTRAINT user_access_fkey_system_subscription_client FOREIGN KEY (system_subscription_client_id) REFERENCES tenants.system_subscription_client(id);
ALTER TABLE tenants.user_access ADD CONSTRAINT user_access_fkey_email_by_entity FOREIGN KEY (email_by_entity_id) REFERENCES tenants.email_by_entity(id);
ALTER TABLE tenants.user_access_validity ADD CONSTRAINT user_access_validity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.user_access_validity ADD CONSTRAINT user_access_validity_fkey_user_access FOREIGN KEY (user_access_id) REFERENCES tenants.user_access(id);
ALTER TABLE tenants.session ADD CONSTRAINT session_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.session ADD CONSTRAINT session_fkey_user_access FOREIGN KEY (user_access_id) REFERENCES tenants.user_access(id);
ALTER TABLE tenants.recovery_password ADD CONSTRAINT recovery_password_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.recovery_password ADD CONSTRAINT recovery_password_fkey_user_access FOREIGN KEY (user_access_id) REFERENCES tenants.user_access(id);
ALTER TABLE tenants.recovery_password_notify ADD CONSTRAINT recovery_password_notify_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.recovery_password_notify ADD CONSTRAINT recovery_password_notify_fkey_recovery_password FOREIGN KEY (recovery_password_id) REFERENCES tenants.recovery_password(id);
ALTER TABLE tenants.recovery_password_notify ADD CONSTRAINT recovery_password_notify_fkey_phone_by_entity FOREIGN KEY (phone_by_entity_id) REFERENCES tenants.phone_by_entity(id);
ALTER TABLE tenants.recovery_password_notify ADD CONSTRAINT recovery_password_notify_fkey_email_by_entity FOREIGN KEY (email_by_entity_id) REFERENCES tenants.email_by_entity(id);
ALTER TABLE tenants.entity ADD CONSTRAINT entity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.entity ADD CONSTRAINT entity_fkey_fusion_master_entity FOREIGN KEY (fusion_master_entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.natural_entity_gender ADD CONSTRAINT natural_entity_gender_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.natural_entity ADD CONSTRAINT natural_entity_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.natural_entity ADD CONSTRAINT natural_entity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.natural_entity ADD CONSTRAINT natural_entity_fkey_natural_entity_gender FOREIGN KEY (natural_entity_gender_id) REFERENCES tenants.natural_entity_gender(id);
ALTER TABLE tenants.identity_document_category ADD CONSTRAINT identity_document_category_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.identity_document_category ADD CONSTRAINT identity_document_category_fkey_parent FOREIGN KEY (parent_id) REFERENCES tenants.identity_document_category(id);
ALTER TABLE tenants.identity_document_category ADD CONSTRAINT identity_document_category_fkey_region FOREIGN KEY (region_id) REFERENCES osbs.region(id);
ALTER TABLE tenants.identity_document_category ADD CONSTRAINT identity_document_category_fkey_subregion FOREIGN KEY (subregion_id) REFERENCES osbs.subregion(id);
ALTER TABLE tenants.identity_document_category ADD CONSTRAINT identity_document_category_fkey_country FOREIGN KEY (country_id) REFERENCES osbs.country(id);
ALTER TABLE tenants.identity_document_category ADD CONSTRAINT identity_document_category_fkey_state FOREIGN KEY (state_id) REFERENCES osbs.state(id);
ALTER TABLE tenants.identity_document_category ADD CONSTRAINT identity_document_category_fkey_city FOREIGN KEY (city_id) REFERENCES osbs.city(id);
ALTER TABLE tenants.identity_document ADD CONSTRAINT identity_document_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.identity_document ADD CONSTRAINT identity_document_fkey_identity_document_category FOREIGN KEY (identity_document_category_id) REFERENCES tenants.identity_document_category(id);
ALTER TABLE tenants.identity_document_by_entity ADD CONSTRAINT identity_document_by_entity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.identity_document_by_entity ADD CONSTRAINT identity_document_by_entity_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.identity_document_by_entity ADD CONSTRAINT identity_document_by_entity_fkey_identity_document FOREIGN KEY (identity_document_id) REFERENCES tenants.identity_document(id);
ALTER TABLE tenants.entity_name_type ADD CONSTRAINT entity_name_type_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.entity_name ADD CONSTRAINT entity_name_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.entity_name_by_entity ADD CONSTRAINT entity_name_by_entity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.entity_name_by_entity ADD CONSTRAINT entity_name_by_entity_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.entity_name_by_entity ADD CONSTRAINT entity_name_by_entity_fkey_entity_name FOREIGN KEY (entity_name_id) REFERENCES tenants.entity_name(id);
ALTER TABLE tenants.entity_name_by_entity ADD CONSTRAINT entity_name_by_entity_fkey_entity_name_type FOREIGN KEY (entity_name_type_id) REFERENCES tenants.entity_name_type(id);
ALTER TABLE tenants.entity_address ADD CONSTRAINT entity_address_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.entity_address ADD CONSTRAINT entity_address_fkey_region FOREIGN KEY (region_id) REFERENCES osbs.region(id);
ALTER TABLE tenants.entity_address ADD CONSTRAINT entity_address_fkey_subregion FOREIGN KEY (subregion_id) REFERENCES osbs.subregion(id);
ALTER TABLE tenants.entity_address ADD CONSTRAINT entity_address_fkey_country FOREIGN KEY (country_id) REFERENCES osbs.country(id);
ALTER TABLE tenants.entity_address ADD CONSTRAINT entity_address_fkey_state FOREIGN KEY (state_id) REFERENCES osbs.state(id);
ALTER TABLE tenants.entity_address ADD CONSTRAINT entity_address_fkey_city FOREIGN KEY (city_id) REFERENCES osbs.city(id);
ALTER TABLE tenants.entity_address ADD CONSTRAINT entity_address_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.phone_by_entity ADD CONSTRAINT phone_by_entity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.phone_by_entity ADD CONSTRAINT phone_by_entity_fkey_phone FOREIGN KEY (phone_id) REFERENCES osbs.phone(id);
ALTER TABLE tenants.phone_by_entity ADD CONSTRAINT phone_by_entity_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.email_by_entity ADD CONSTRAINT email_by_entity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.email_by_entity ADD CONSTRAINT email_by_entity_fkey_email FOREIGN KEY (email_id) REFERENCES osbs.email(id);
ALTER TABLE tenants.email_by_entity ADD CONSTRAINT email_by_entity_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.department ADD CONSTRAINT department_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.department ADD CONSTRAINT department_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.department ADD CONSTRAINT department_fkey_parent FOREIGN KEY (parent_id) REFERENCES tenants.department(id);
ALTER TABLE tenants.job_family ADD CONSTRAINT job_family_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.job_family ADD CONSTRAINT job_family_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.position ADD CONSTRAINT position_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.position ADD CONSTRAINT position_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.position ADD CONSTRAINT position_fkey_parent FOREIGN KEY (parent_id) REFERENCES tenants.position(id);
ALTER TABLE tenants.position ADD CONSTRAINT position_fkey_job_family FOREIGN KEY (job_family_id) REFERENCES tenants.job_family(id);
ALTER TABLE tenants.position ADD CONSTRAINT position_fkey_department FOREIGN KEY (department_id) REFERENCES tenants.department(id);
ALTER TABLE tenants.employee ADD CONSTRAINT employee_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.employee ADD CONSTRAINT employee_fkey_person_entity FOREIGN KEY (person_entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.employee ADD CONSTRAINT employee_fkey_legal_entity FOREIGN KEY (legal_entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.employee_validity ADD CONSTRAINT employee_validity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.employee_validity ADD CONSTRAINT employee_validity_fkey_employee FOREIGN KEY (employee_id) REFERENCES tenants.employee(id);
ALTER TABLE tenants.employee_per_position ADD CONSTRAINT employee_per_position_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.employee_per_position ADD CONSTRAINT employee_per_position_fkey_employee FOREIGN KEY (employee_id) REFERENCES tenants.employee(id);
ALTER TABLE tenants.employee_per_position ADD CONSTRAINT employee_per_position_fkey_position FOREIGN KEY (position_id) REFERENCES tenants.position(id);
ALTER TABLE tenants.employee_per_position_validity ADD CONSTRAINT employee_per_position_validity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.employee_per_position_validity ADD CONSTRAINT employee_per_position_validity_fkey_employee_per_position FOREIGN KEY (employee_per_position_id) REFERENCES tenants.employee_per_position(id);
ALTER TABLE tenants.shareholding ADD CONSTRAINT shareholding_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.shareholding ADD CONSTRAINT shareholding_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.shareholding ADD CONSTRAINT shareholding_fkey_shareholer_entity FOREIGN KEY (shareholer_entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.shareholding_validity ADD CONSTRAINT shareholding_validity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.shareholding_validity ADD CONSTRAINT shareholding_validity_fkey_shareholding FOREIGN KEY (shareholding_id) REFERENCES tenants.shareholding(id);
ALTER TABLE tenants.subsidiary ADD CONSTRAINT subsidiary_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.subsidiary ADD CONSTRAINT subsidiary_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.subsidiary ADD CONSTRAINT subsidiary_fkey_parent_entity FOREIGN KEY (parent_entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.subsidiary_validity ADD CONSTRAINT subsidiary_validity_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.subsidiary_validity ADD CONSTRAINT subsidiary_validity_fkey_subsidiary FOREIGN KEY (subsidiary_id) REFERENCES tenants.subsidiary(id);
ALTER TABLE tenants.branch ADD CONSTRAINT branch_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.branch ADD CONSTRAINT branch_fkey_entity FOREIGN KEY (entity_id) REFERENCES tenants.entity(id);
ALTER TABLE tenants.branch ADD CONSTRAINT branch_fkey_parent FOREIGN KEY (parent_id) REFERENCES tenants.branch(id);
ALTER TABLE tenants.branch ADD CONSTRAINT branch_fkey_position FOREIGN KEY (position_id) REFERENCES tenants.position(id);
ALTER TABLE tenants.branch ADD CONSTRAINT branch_fkey_subsidiary FOREIGN KEY (subsidiary_id) REFERENCES tenants.subsidiary(id);
ALTER TABLE tenants.identity_document_by_entity_by_branch ADD CONSTRAINT identity_document_by_entity_by_branch_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.identity_document_by_entity_by_branch ADD CONSTRAINT identity_document_by_entity_by_branch_fkey_branch FOREIGN KEY (branch_id) REFERENCES tenants.branch(id);
ALTER TABLE tenants.identity_document_by_entity_by_branch ADD CONSTRAINT identity_document_by_entity_by_branch_fkey_ident_doc_by_ent FOREIGN KEY (identity_document_by_entity_id) REFERENCES tenants.identity_document_by_entity(id);
ALTER TABLE tenants.entity_address_by_branch ADD CONSTRAINT entity_address_by_branch_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.entity_address_by_branch ADD CONSTRAINT entity_address_by_branch_fkey_branch FOREIGN KEY (branch_id) REFERENCES tenants.branch(id);
ALTER TABLE tenants.entity_address_by_branch ADD CONSTRAINT entity_address_by_branch_fkey_entity_address FOREIGN KEY (entity_address_id) REFERENCES tenants.entity_address(id);
ALTER TABLE tenants.phone_by_entity_by_branch ADD CONSTRAINT phone_by_entity_by_branch_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.phone_by_entity_by_branch ADD CONSTRAINT phone_by_entity_by_branch_fkey_branch FOREIGN KEY (branch_id) REFERENCES tenants.branch(id);
ALTER TABLE tenants.phone_by_entity_by_branch ADD CONSTRAINT phone_by_entity_by_branch_fkey_phone_by_entity FOREIGN KEY (phone_by_entity_id) REFERENCES tenants.phone_by_entity(id);
ALTER TABLE tenants.email_by_entity_by_branch ADD CONSTRAINT email_by_entity_by_branch_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);
ALTER TABLE tenants.email_by_entity_by_branch ADD CONSTRAINT email_by_entity_by_branch_fkey_branch FOREIGN KEY (branch_id) REFERENCES tenants.branch(id);
ALTER TABLE tenants.email_by_entity_by_branch ADD CONSTRAINT email_by_entity_by_branch_fkey_email_by_entity FOREIGN KEY (email_by_entity_id) REFERENCES tenants.email_by_entity(id);
ALTER TABLE tenants.attached_documents ADD CONSTRAINT attached_documents_fkey_system_subscription FOREIGN KEY (system_subscription_id) REFERENCES osbs.system_subscription(id);



-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Enabling RLS for tenants schema tables: -----------------------------------------------------------------------------------------------------------------------------------------------------
-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- ALTER TABLE osbs.audit_log ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE osbs.system_subscription ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE osbs.system_subscription_validity ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE osbs.system_client ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE osbs.phone ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE osbs.email ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.system_subscription_owner ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.system_subscription_client ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.user_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.user_access_validity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.session ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.recovery_password ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.recovery_password_notify ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.entity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.natural_entity_gender ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.natural_entity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.identity_document_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.identity_document ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.identity_document_by_entity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.entity_name_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.entity_name ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.entity_name_by_entity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.entity_address ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.phone_by_entity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.email_by_entity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.department ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.job_family ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.position ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.employee ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.employee_validity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.employee_per_position ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.employee_per_position_validity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.shareholding ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.shareholding_validity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.subsidiary ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.subsidiary_validity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.branch ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.identity_document_by_entity_by_branch ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.entity_address_by_branch ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.phone_by_entity_by_branch ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.email_by_entity_by_branch ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants.attached_documents ENABLE ROW LEVEL SECURITY;


-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- Defining RLS Policy for tenants schema tables: ----------------------------------------------------------------------------------------------------------------------------------------------
-- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- CREATE POLICY tenant_isolation ON osbs.audit_log FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
-- CREATE POLICY tenant_isolation ON osbs.system_subscription FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
-- CREATE POLICY tenant_isolation ON osbs.system_subscription_validity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
-- CREATE POLICY tenant_isolation ON osbs.system_client FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
-- CREATE POLICY tenant_isolation ON osbs.phone FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
-- CREATE POLICY tenant_isolation ON osbs.email FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.audit_log FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.system_subscription_owner FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.system_subscription_client FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.user_access FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.user_access_validity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.session FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.recovery_password FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.recovery_password_notify FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.entity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.natural_entity_gender FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.natural_entity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.identity_document_category FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.identity_document FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.identity_document_by_entity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.entity_name_type FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.entity_name FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.entity_name_by_entity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.entity_address FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.phone_by_entity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.email_by_entity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.department FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.job_family FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.position FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.employee FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.employee_validity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.employee_per_position FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.employee_per_position_validity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.shareholding FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.shareholding_validity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.subsidiary FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.subsidiary_validity FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.branch FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.identity_document_by_entity_by_branch FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.entity_address_by_branch FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.phone_by_entity_by_branch FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.email_by_entity_by_branch FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);
CREATE POLICY tenant_isolation ON tenants.attached_documents FOR ALL USING (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID) WITH CHECK (system_subscription_id = current_setting('app.current_system_subscription_id')::UUID);