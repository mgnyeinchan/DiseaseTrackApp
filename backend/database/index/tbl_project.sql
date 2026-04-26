-- Separate Run

-- 👉 ဒီလို ၂ ခါ run

-- Step 1

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Step 2
CREATE INDEX CONCURRENTLY idx_project_search
ON tbl_project
USING gin (project_name gin_trgm_ops, project_code gin_trgm_ops);