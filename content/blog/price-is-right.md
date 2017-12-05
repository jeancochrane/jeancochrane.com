title: The Price Is Right: SQL Edition
summary: The costs and benefits of declarative programming.
date: 2017-12-04
category: code
tags: SQL; declarative programming
published: true


> Why's everything so expensive?
> 
> - Frances Quinlan, ["Tibetan Pop
> Stars"](https://hopalong.bandcamp.com/track/tibetan-pop-stars)

This week I learned how to read Postgres' query planner, which means I
get to play _The Price Is Right_ with SQL queries.
(I grew up on [_Antiques Roadshow_](https://en.wikipedia.org/wiki/Antiques_Roadshow),
but it's not nearly as expressive of an example.)

Here's a simplified version of one recent game that came up in the office: say
you're trying to group fruits
by category, and you want to keep track of your guesses. (Did you know that
botanists think [eggplants are berries, but strawberries
aren't](https://en.wikipedia.org/wiki/Berry)? Not as easy as you thought, huh?)

To keep track of your guesses, you have two relations: `fruits` and `categories`.
`fruits` stores the names of the fruits you're learning about, along with a
unique identifier; `categories` stores the category for each fruit, along with
a flag declaring whether it's a current guess or not. (Remember, you're 
changing your mind about the categories, and you need to preserve the history
of your guesses.)

Here are simple tables for each relation:

### `fruits`

| id | name | 
| -- | -- |
| 1 | eggplant |
| 2 | strawberry |
| 4 | grape |
| 5 | pineapple |

*Index on `record_id`*

### `categories`

| id | category | current |
| --------- | ----- | ------- |
| 1 | berry | t |
| 2 | aggregate fruit | t |
| 4 | berry | t | 
| 1 | vegetable | f |
| 2 | berry | f |

*Index on (`record_id`, `current is TRUE`)*

You can see how the history plays out in the table above: noting that eggplants
are (botanically speaking) berries, while strawberries are [_aggregate
fruits_](https://en.wikipedia.org/wiki/Aggregate_fruit),
you've updated the table and marked your previous guesses with the flag
`current is FALSE`.

On to the task: Your challenge is to find **the cheapest way of determining the _current_ overlap
between `fruits` and `categories`**. That is, as the length of these tables
grows without bound, what's the fastest way to find out how many fruits in `fruits` 
have a category in `categories` where `current is TRUE`?

Notice a few interesting properties of the relations:

- **The same fruit can be in `categories` twice**. In this example,
  `strawberry` and `eggplant` have two representation in `categories`, one
  of which is _no longer current_.
- **Not all fruits necessarily have a category in `categories`... yet**.
  Eventually you hope to have a full catalogue of all the fruits in the world,
  but it's a work in progress. In this case, `pineapple` still needs a category.
- It's possible for there to be **gaps in the sequence of IDs** for both tables,
  like where we might expect `3` to be. The IDs for the fruits are not necessarily
  continuous. (Sometimes you realize that a fruit isn't a fruit at all, and you
  need to delete it.) 

The first way my team approached this problem was to try to do something
clever. We used an outer join on `id` in an attempt to expose the NULLS in
`categories`:

```sql
SELECT 1 
FROM fruits
LEFT JOIN (
    SELECT id
    FROM categories
    WHERE current = TRUE
) AS current_categories
USING (id)
WHERE current_categories.id IS NULL 
```

On our two sample tables, this query would return a join table:

```
| id | name | category | current | 
| -- | -- | -- | -- |
| 1 | eggplant | berry | t | 
| 2 | strawberry | aggregate fruit | t |
| 4 | grape | berry | t |
| 5 | pineapple | | |

Then, we can wrap the query in all in an `EXISTS` clause, so the query would return as soon
as it found a tuple that was represented in `fruits` but not `current_categories`

```sql
SELECT EXISTS(
    SELECT 1
    FROM fruits
    LEFT JOIN (
        SELECT id
        FROM categories
        WHERE current = TRUE
    ) AS current_categories
    USING (id)
    WHERE current_categories.id IS NULL 
)
```

In the example above, the tuple encompassing `pineapple` will lead the `EXISTS` clause to
return `TRUE`: there are gaps in the overlap after all! `SELECT EXISTS` doesn't
really help in the absolute worst case, when the two tables overlap completely.
But in all other cases, we reasoned that it would improve efficiency.

Unfortunately, here's where **declarative programming** came back to bite us:
this query wasn't executing at all the way we had hoped. In fact, on certain tables,
it was _really_ inefficient!

To get a sense of how Postgres would run the query, we prefixed it with
the command `EXPLAIN`:

```sql
EXPLAIN SELECT EXISTS(
    SELECT 1
    FROM fruits
    ...
```

In response to a request to `EXPLAIN` itself, Postgres returns a _query plan_,
which is a detailed description of the algorithms, tables, indeces, filters,
etc. that it plans to use to respond to a query. Here's what the plan looks
like for our clever `EXISTS` query:

```
                                  QUERY PLAN
--------------------------------------------------------------------------------
 Result  (cost=229.19..229.20 rows=1 width=1)
   InitPlan 1 (returns $0)
     ->  Hash Anti Join  (cost=105.69..229.19 rows=1 width=0)
           Hash Cond: (fruits.id = current_categories.id)
           ->  Index Only Scan using fruits_pkey on fruits 
               (cost=0.28..106.28 rows=2000 width=8)
           ->  Hash  (cost=80.41..80.41 rows=2000 width=8)
                 ->  Seq Scan on categories (cost=0.00..80.41 rows=2000 width=8)
                       Filter: current
```

[How to read?]

### TK: other approaches

What if we returned a count of tuples where `current_categories.id is NULL`,
instead of using `EXISTS`?

```sql
SELECT COUNT(id)
FROM fruits
LEFT JOIN (
    SELECT id
    FROM categories
    WHERE current IS TRUE
) AS current_categories
USING(id)
WHERE current_categories.id IS NULL
```

```
                                  QUERY PLAN
--------------------------------------------------------------------------------
 Aggregate  (cost=229.19..229.20 rows=1 width=8)
   ->  Hash Anti Join  (cost=105.69..229.19 rows=1 width=8)
         Hash Cond: (fruits.id = current_categories.id)
         ->  Index Only Scan using fruits_pkey on fruits
             (cost=0.28..106.28 rows=2000 width=8)
         ->  Hash  (cost=80.41..80.41 rows=2000 width=8)
               ->  Seq Scan on categories  (cost=0.00..80.41 rows=2000 width=8)
                     Filter: current
```

`bool_or` variant of the outer join approach: 

```sql
SELECT BOOL_OR(TRUE)
FROM fruits
LEFT JOIN (
    SELECT id
    ...
```

```
                                  QUERY PLAN
--------------------------------------------------------------------------------
 Aggregate  (cost=229.19..229.20 rows=1 width=1)
   ->  Hash Anti Join  (cost=105.69..229.19 rows=1 width=0)
         Hash Cond: (fruits.id = current_categories.id)
         ->  Index Only Scan using fruits_pkey" on fruits
             (cost=0.28..106.28 rows=2000 width=8)
         ->  Hash  (cost=80.41..80.41 rows=2000 width=8)
               ->  Seq Scan on categories  (cost=0.00..80.41 rows=2000 width=8)
                     Filter: current
```

Select `record_id` from the processed table where it does not exists in the changelog:

```sql
SELECT id
FROM fruits
WHERE NOT EXISTS(
    SELECT 1
    FROM categories
    WHERE fruits.id = categories.id
    AND current = TRUE
)
```

```
                                  QUERY PLAN
--------------------------------------------------------------------------------
 Hash Anti Join  (cost=105.69..229.19 rows=1 width=8)
   Hash Cond: (fruits.id = categories.id)
   ->  Index Only Scan using fruits_pkey on fruits
       (cost=0.28..106.28 rows=2000 width=8)
   ->  Hash  (cost=80.41..80.41 rows=2000 width=8)
         ->  Seq Scan on categories  (cost=0.00..80.41 rows=2000 width=8)
               Filter: current
```

And finally, here's what we actually did:

```sql
WITH
  fruit_cardinality AS (
    SELECT COUNT(id)
    FROM fruits
),
  category_cardinality AS (
    SELECT COUNT(id)
    FROM categories 
    WHERE current = True
)
SELECT
    (SELECT count FROM fruit_cardinality)
  = (SELECT count FROM category_cardinality)
```

Query plan:

```
                                  QUERY PLAN
--------------------------------------------------------------------------------
Result  (cost=196.75..196.76 rows=1 width=1)
   CTE fruit_count
     ->  Aggregate  (cost=111.28..111.29 rows=1 width=8)
           ->  Index Only Scan using fruits_pkey on fruits 
               (cost=0.28..106.28 rows=2000 width=8)
   CTE category_count
     ->  Aggregate  (cost=85.41..85.42 rows=1 width=8)
           ->  Seq Scan on categories 
               (cost=0.00..80.41 rows=2000 width=8)
                 Filter: current
   InitPlan 3 (returns $2)
     ->  CTE Scan on fruit_count  (cost=0.00..0.02 rows=1 width=8)
   InitPlan 4 (returns $3)
     ->  CTE Scan on category_count  (cost=0.00..0.02 rows=1 width=8)
```

Now, if we had confidence that the sequence of IDs used by the two tables was
continuous (i.e. that there were no gaps, like how we're missing a tuple for
`3` that we would expect), we could get **even more efficient** by using the
`MAX` aggregate function!

```sql
WITH
  fruit_cardinality AS (
    SELECT MAX(id)
    FROM fruits
  ),
  ...
```

Query plan:

```
                                  QUERY PLAN
--------------------------------------------------------------------------------
 Result  (cost=85.80..85.82 rows=1 width=1)
   CTE fruit_cardinality 
     ->  Result  (cost=0.33..0.34 rows=1 width=8)
           InitPlan 1 (returns $0)
             ->  Limit  (cost=0.28..0.33 rows=1 width=8)
                   ->  Index Only Scan Backward using fruits_pkey on fruits 
                       (cost=0.28..111.28 rows=2000 width=8)
                         Index Cond: (id IS NOT NULL)
   CTE category_cardinality 
     ->  Aggregate  (cost=85.41..85.42 rows=1 width=8)
           ->  Seq Scan on categories (cost=0.00..80.41 rows=2000 width=8)
                 Filter: current
   InitPlan 4 (returns $3)
     ->  CTE Scan on fruit_cardinality  (cost=0.00..0.02 rows=1 width=8)
   InitPlan 5 (returns $4)
     ->  CTE Scan on category_cardinality  (cost=0.00..0.02 rows=1 width=8)
```

[Costs and benefits of declarative programming]
