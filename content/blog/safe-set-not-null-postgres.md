title: One Weird Trick to Make SET NOT NULL Safer in Postgres 
summary: SET NOT NULL can be dangerous on large production tables. It doesn't have to be.
date: 2022-05-02
category: code
slug: safe-set-not-null-postgres.md 
thumbnail: /static/images/blog/netlify-identity-dealbreakers/netlify-logo.png
tags: postgres; databases; migrations; ddl 
published: true 


As far as Postgres Data Definition Language (DDL) operations go, `ALTER TABLE... SET NOT 
NULL` is controversial. On the one hand, it's nice to get built-in validation that incoming
records cannot be null, and it's cool that the psql shell will display this aspect of a field to
you in the little table when you describe the table with `\d $tablename`.

On the other hand, running `SET NOT NULL` on a large production table can easily bring down 
your service if you're not careful.

## How `SET NOT NULL` can crash your app

There are three key problems with `ALTER TABLE... SET NOT NULL`:
1. The operation immediately validates the not-null constraint for all existing rows in your table.
2. Postgres always performs this validation using a full table scan, whether or not an index 
exists on the column in question.
3. `ALTER TABLE... SET NOT NULL` holds an `ACCESS EXCLUSIVE` lock on the table until it 
completes. 

Put simply, we're looking at:
1. A long-running DDL operation;
2. via a mandatory full-table scan;
3. holding an exclusive lock on your table. 

This is a recipe for disaster. Holding an exclusive lock on a large, high-throughput 
table for as little as four seconds can produce measurable downtime as connections begin
to block and your request queue balloons. A full table scan of 50m records will easily
run you ten seconds, if you're lucky.

There has to be a better way.

## The conventional solution: Use not-valid constraints

Most people will tell you that the answer to this problem is to add the constraint via `ALTER 
TABLE... ADD CONSTRAINT... NOT VALID` instead of `SET NOT NULL`. When you run `ADD 
CONSTRAINT` with the option `NOT VALID`, Postgres will defer validation of existing records 
until you run a separate `ALTER TABLE... VALIDATE CONSTRAINT` operation, which acquires a
less strict lock on the table (`SHARE UPDATE EXCLUSIVE`).

I find this solution to be unhygienic because it's not _actually_ setting the column to not-null,
it's setting a _constraint_, which are similar but distinct concepts. The end behavior is
identical (both existing and incoming rows are validated to be not-null) but constraints and
not-null columns are represented as two different attributes in the schema, which can be 
confusing. Engineers often jump to the field definition to check if an unfamiliar field is 
nullable; now they have to remember to comb through the list of constraints as well, which are 
often long and hard to parse on high-cardinality tables.

You might think that there would be a `NOT VALID` option to `SET NOT NULL`, but there isn't.
This is frustrating, because it turns out that it's pretty easy to hack together a PL/pgSQL
function that accomplishes the same goal.

## The fun solution: Write a function for safe `SET NOT NULL` operations

The key insight for a safe, custom `SET NOT NULL` is that `SET NOT NULL` does three simple 
things under the hood:

1. Issue an `ACCESS EXCLUSIVE` lock on the table
2. Run a full-table scan to confirm that no rows are null
3. Update `pg_catalog.pg_attributes` to set `attnotnull = TRUE` for the column

That's it! Pretty easy, and actually quite fast, except for the full-table scan. If we can
replace the second step with a check that leverages indexes, we can speed up the oeration to the
point where it executes basically instantly.

First, make sure you have an index on the column. If you don't have one, make one temporarily
(remembering to use `CONCURRENTLY` so you don't issue another `ACCESS EXCLUSIVE` lock):

```sql
CREATE INDEX CONCURRENTLY tmp_foo_bar_is_null ON foo (bar) WHERE bar IS NULL;
```

Next, define the function:

```sql
-- Set a column to NOT NULL without requiring a sequential scan.
--
-- Create the function in the pg_temp namespace so that it is only visible to the calling
-- connection and gets dropped at the end of the connection's life
CREATE FUNCTION pg_temp.SET_NOT_NULL(_Schema name, _Table name, _Column name)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
_TableOID   oid;
_AttNOTNULL boolean;
_NULLExists boolean;
_OK         boolean;
BEGIN

SET LOCAL lock_timeout = '4s';

SET LOCAL statement_timeout = '4s';

-- Take an ACCESS EXCLUSIVE lock on the entire table,
-- just like normal ALTER TABLE DDL commands do
EXECUTE format('LOCK TABLE %%I.%%I IN ACCESS EXCLUSIVE MODE', _Schema, _Table);

SELECT
    pg_attribute.attrelid,
    pg_attribute.attnotnull
INTO STRICT
    _TableOID,
    _AttNOTNULL
FROM pg_class
INNER JOIN pg_namespace ON pg_namespace.oid      = pg_class.relnamespace
INNER JOIN pg_attribute ON pg_attribute.attrelid = pg_class.oid
WHERE pg_namespace.nspname    = _Schema
AND pg_class.relname          = _Table
AND pg_attribute.attname      = _Column
AND pg_class.relkind          = 'r'
AND pg_attribute.attnum       > 0
AND pg_attribute.attisdropped IS FALSE
AND NOT pg_is_other_temp_schema(pg_namespace.oid);

IF _AttNOTNULL THEN
    RAISE NOTICE 'NOT NULL is already set for column %%.%%.%%', _Schema, _Table, _Column;
    RETURN TRUE;
END IF;

-- Verify there are no rows in the table where the column IS NULL:
EXECUTE format('SELECT EXISTS (SELECT 1 FROM %%I.%%I WHERE %%I IS NULL) ', _Schema, _Table, _Column)
INTO STRICT _NULLExists;

IF _NULLExists THEN
    RAISE 'column "%%.%%.%%" contains null values', _Schema, _Table, _Column USING ERRCODE = 'check_violation';
END IF;

-- Set NOT NULL for the column by updating the pg_catalog directly:

EXECUTE format('
    UPDATE pg_catalog.pg_attribute SET attnotnull = TRUE
    WHERE attrelid = %%L::oid
    AND   attname  = %%L
    RETURNING TRUE
', _TableOID, _Column
) INTO STRICT _OK;

IF _OK IS NOT TRUE THEN
    RAISE EXCEPTION 'Failed setting attnotnull to TRUE';
END IF;

RETURN TRUE;
END;
$$
```

And finally, call the function in your migration script:

```sql
SELECT pg_temp.SET_NOT_NULL('public', 'foo', 'bar');
```

Remember to drop your index to avoid index bloat:

```sql
DROP INDEX CONCURRENTLY tmp_foo_bar_is_null;
```

## Acknowledgements

The code above is quite shamelessly cribbed from an idea that [Joel Jacobson sent to the 
Postgres mailing list in 2016](https://www.postgresql.org/message-id/CAASwCXdAK55BzuOy_FtYj2zQWg26PriDKL5pRoWiyFJe0eg-Hg@mail.gmail.com).
By copying Joel's idea and elaborating on it, I'm hoping at worst that Joel's idea will be easier
to digest, and at best that a heroic Postgres contributor might decide to take some time to
build this feature into Postgres core. So thanks, Joel!
