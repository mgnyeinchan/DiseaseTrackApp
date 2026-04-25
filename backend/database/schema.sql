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

CREATE TABLE tbl_cases (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    age INT CHECK (age >= 0)
);

CREATE TABLE tbl_users (
    user_id SERIAL PRIMARY KEY,
    user_username TEXT UNIQUE NOT NULL,
    user_password TEXT NOT NULL,
    user_role TEXT DEFAULT 'user',
    user_failed_attempts INT DEFAULT 0,
    user_is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tbl_users
ADD COLUMN user_status INT DEFAULT 0;