#!/usr/bin/env zsh
SCRIPT_DIR="$(cd -- "$(dirname -- "${(%):-%N}")" &> /dev/null && pwd)"

SCHEMA_DIR="$SCRIPT_DIR/migrations"
DB_URL="postgresql://postgres:postgres@localhost:54322/postgres"

echo "🔥 Dropping all public tables..."
psql "$DB_URL" -v ON_ERROR_STOP=1 -c "
DO \$\$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
  END LOOP;
END;
\$\$;
"

SCHEMA_FILE=$(find "$SCHEMA_DIR" -name "*.sql" | head -n 1)

echo "Applying schema from $SCHEMA_FILE"
psql "$DB_URL" -f "$SCHEMA_FILE"
