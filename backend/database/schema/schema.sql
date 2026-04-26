-- =========================================
-- DATABASE
-- =========================================
CREATE DATABASE surveillancedb;

-- =========================================
-- ROLES
-- =========================================

-- Owner role (full control)
CREATE ROLE surveillance_owner WITH LOGIN PASSWORD 'CHANGE_THIS_PASSWORD';

-- Application role (CRUD access)
CREATE ROLE surveillance_app WITH LOGIN PASSWORD 'CHANGE_THIS_PASSWORD';

-- Read-only role
CREATE ROLE surveillance_read WITH LOGIN PASSWORD 'CHANGE_THIS_PASSWORD';

-- =========================================
-- DATABASE OWNERSHIP
-- =========================================

ALTER DATABASE surveillancedb OWNER TO surveillance_owner;

-- Owner full access
GRANT ALL ON SCHEMA public TO surveillance_owner;

-- =========================================
-- CONNECTION & SCHEMA ACCESS
-- =========================================

GRANT CONNECT ON DATABASE surveillancedb TO surveillance_app;
GRANT CONNECT ON DATABASE surveillancedb TO surveillance_read;

GRANT USAGE ON SCHEMA public TO surveillance_app;
GRANT USAGE ON SCHEMA public TO surveillance_read;

-- =========================================
-- APP USER PERMISSIONS (CRUD)
-- =========================================

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO surveillance_app;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO surveillance_app;

-- =========================================
-- READ-ONLY USER PERMISSIONS
-- =========================================

GRANT SELECT
ON ALL TABLES IN SCHEMA public
TO surveillance_read;

-- =========================================
-- DEFAULT PRIVILEGES (FOR FUTURE TABLES)
-- =========================================

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO surveillance_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT ON TABLES TO surveillance_read;

-- =========================================
-- TABLES
-- =========================================

