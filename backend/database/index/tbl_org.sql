-- ၂ ခါ run
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX CONCURRENTLY idx_org_search
ON tbl_org
USING gin (org_name gin_trgm_ops, org_code gin_trgm_ops);