title: The Price Is Right: SQL Edition
summary: The PostgreSQL query planner makes clear the costs and benefits of declarative programming.
date: 2017-12-04
category: code
slug: price-is-right
tags: SQL; declarative programming
published: true


> **Why's everything so expensive?**
> 
> *Frances Quinlan, ["Tibetan Pop
> Stars"](https://hopalong.bandcamp.com/track/tibetan-pop-stars)*

A hidden gem of the PostgreSQL database system is its **query planner**, which
you can use to play _The Price Is Right_ with SQL
expressions.[^antiques-roadshow]
By estimating how expensive a given SQL expression will be, the query planner nicely
illustrates some of the costs and benefits of the
declarative programming paradigm that SQL takes part in.

First, some important background: Postgres needs a query planner because SQL is
a *declarative* language. Unlike in *imperative* languages like Python,
when you run a SQL expression in a database engine like Postgres, you don't give your machine instructions on
how to get or change the information that you care about; instead, you describe
the information you want with a statement like `SELECT id FROM products JOIN suppliers USING(id)`
and the database engine figures out how to get it for you. Since you're *declaring* what you would like to happen,
instead of providing an *imperative* for how it should be done, SQL is a "declarative"
language.[^declarative-programming]

Declarative programming is really fun for the user, but it poses a conundrum for the people
who have to write the database engines that we use. The declarative paradigm
means that Postgres has to somehow figure out how to execute expressions on its
own.

Enter the query planner: Postgres' clever piece of software
that figures out how to get what you want from your database.

Before running any
given SQL expression, Postgres uses its query planner to determine the most
efficient way of doing what you want it to do. The query planner is a tool
internal to Postgres, but it's also available to us as end users. Prepend any query with the keyword `EXPLAIN`
(with the optional keyword `ANALYZE`) and Postgres will show you what it thinks
is the best way to execute your expression. `EXPLAIN` shows an execution tree
mapping out Postgres' plan for the expression; `EXPLAIN ANALYZE` will actually
*execute* that plan, reporting back the time and memory costs that it incurs.

## A dummy example: grouping fruits

To see the query planner in action, take a simplified version of one recent
puzzle that came up in our office. Say you're trying to group fruits
by category, and you want to keep track of your guesses. (Did you know that
botanists think [eggplants are berries, but strawberries
aren't](https://en.wikipedia.org/wiki/Berry)? Not as easy as you thought, huh?)

To keep track of your guesses, you have two relations: `fruit` and `category`.
`fruit` stores the names of the fruits you're learning about, along with a
unique identifier; `category` stores the category for each fruit, along with
a flag declaring whether it's a current guess or not. (Remember, you're 
changing your mind about the categories, and you need to preserve the history
of your guesses.)

Here are simple tables for each relation:

### `fruit`

<div class="row">
    <div class="col-xs-12 col-sm-6">
        <table class="table table-responsive table-bordered">
            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>eggplant</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>strawberry</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>grape</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>pineapple</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

*Index on `record_id`*

### `category`

<div class="row">
    <div class="col-xs-12 col-sm-6">
        <table class="table table-responsive table-bordered">
            <thead>
                <tr>
                    <th>id</th>
                    <th>category</th>
                    <th>current</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>berry</td>
                    <td>true</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>aggregate fruit</td>
                    <td>true</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>berry</td>
                    <td>true</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>vegetable</td>
                    <td>false</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>berry</td>
                    <td>false</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

*Index on (`record_id`, `current is TRUE`)*

You can see how your guess history gets logged in `category` above: noting that eggplants
are (botanically speaking) berries, while strawberries are [_aggregate
fruits_](https://en.wikipedia.org/wiki/Aggregate_fruit),
you've updated the table and marked your previous guesses with the flag
`current is FALSE`.

On to the task: Your challenge is to find **the cheapest way of determining the _current_ overlap
between `fruit` and `category`**. That is, as the length of these tables
grows without bound, what's the fastest way to find out how many fruits in `fruit` 
have a category in `category` where `current is TRUE`? Note that we'll
take "cheap" to mean "fast," although it would make a fun exercise to interpret it
to mean "memory-saving" instead.

Notice a few interesting properties of the relations:

- **The same fruit can be in `category` twice**. In this example,
  `strawberry` and `eggplant` each have two representations in `category`, one
  of which is _no longer current_.
- **Not all fruits necessarily have a category in `category`... yet**.
  Eventually you hope to have a full catalogue of all the fruits in the world,
  but it's a work in progress. In our example, `pineapple` still needs a category.
- It's possible for there to be **gaps in the sequence of IDs** for both tables,
  like where we might expect `3` to be. The IDs for the fruits are not necessarily
  continuous. (Sometimes you realize that a fruit isn't a fruit at all, and you
  need to delete it.) 

The first way my team approached this problem was to try to do something
clever. We used an outer join on `id` in an attempt to expose the NULLS in
`category`:

```sql
SELECT *
FROM fruit
LEFT JOIN (
    SELECT id
    FROM category
    WHERE current = TRUE
) AS current_category
USING (id)
WHERE current_category.id IS NULL 
```

On our two sample tables, this query would return the row that had
a representation in `fruit`, but not in `category`:

<div class="row">
    <div class="col-xs-12 col-sm-6">
        <table class="table table-responsive table-bordered">
            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>category</th>
                    <th>current</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>5</td>
                    <td>pineapple</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

Then, we can wrap the query all in an `EXISTS` clause, so the query would return as soon
as it found this row: 

```sql
SELECT EXISTS(
    SELECT 1
    FROM fruit
    LEFT JOIN (
        SELECT id
        FROM category
        WHERE current = TRUE
    ) AS current_category
    USING (id)
    WHERE current_category.id IS NULL 
)
```

In the example above, the row for `pineapple` will lead the `EXISTS` clause to
return `TRUE`: there are gaps in the overlap after all! `SELECT EXISTS` doesn't
really help in the absolute worst case, when the two tables overlap completely.
But in all other cases, we reasoned that it would improve efficiency.

## Reading the query planner

Unfortunately, here's where the declarative paradigm came back to bite us:
this query wasn't executing at all the way we had hoped. In fact, on certain tables,
it was _really_ inefficient!

To get a sense of how Postgres would run the query, we prefixed it with
an `EXPLAIN`:

```sql
EXPLAIN SELECT EXISTS(
    SELECT 1
    FROM fruit
    ...
```

In response to an `EXPLAIN` command, Postgres prints a tree representing each
step that it plans to
take in order to execute the expression. In our case, here's what the tree
looked like:


```
                                  QUERY PLAN
--------------------------------------------------------------------------------
 Result  (cost=229.19..229.20 rows=1 width=1)
   InitPlan 1 (returns $0)
     ->  Hash Anti Join  (cost=105.69..229.19 rows=1 width=0)
           Hash Cond: (fruit.id = current_category.id)
           ->  Index Only Scan using fruit_pkey on fruit 
               (cost=0.28..106.28 rows=2000 width=8)
           ->  Hash  (cost=80.41..80.41 rows=2000 width=8)
                 ->  Seq Scan on category (cost=0.00..80.41 rows=2000 width=8)
                       Filter: current
```

Starting at the bottom of the tree (`Seq
scan on category`), Postgres says it's going to make a hash
map of `category` by scanning the whole table where `current IS TRUE`, then
compare that map to an index scan on `fruit`.[^hash-map] Each step reports two guesses
at the `cost` of the query: the startup cost, and the total cost. In this case,
Postgres guesses the cost will be `229.19..229.20` disk units per page,
so it'll take about the same amount of time to return the first row as it will
to return the whole table.

Not bad&mdash;but also, not great.
On tables with hundreds of millions of records, this query was
noticeably slow. We'd have to figure out a smarter approach.

(OK, so maybe we *weren't* actually categorizing fruits.)

What if we returned a count of rows where `current_category.id is NULL`,
instead of using `EXISTS`? Would the count improve anything?

```sql
SELECT COUNT(id)
FROM fruit
LEFT JOIN (
    SELECT id
    FROM category
    WHERE current IS TRUE
) AS current_category
USING(id)
WHERE current_category.id IS NULL
```

The query planner reported that this would cost us... the same amount: 

```
                                  QUERY PLAN
--------------------------------------------------------------------------------
 Aggregate  (cost=229.19..229.20 rows=1 width=8)
   ->  Hash Anti Join  (cost=105.69..229.19 rows=1 width=8)
         Hash Cond: (fruit.id = current_category.id)
         ->  Index Only Scan using fruit_pkey on fruit
             (cost=0.28..106.28 rows=2000 width=8)
         ->  Hash  (cost=80.41..80.41 rows=2000 width=8)
               ->  Seq Scan on category  (cost=0.00..80.41 rows=2000 width=8)
                     Filter: current
```

This makes some sense: according to the query planner, the expensive part is
the join (the first branch of the tree, starting with `-> Hash Anti Join`).
Everything else that happens on top of that join matters much less. We can
confirm this is true by trying a [`BOOL_OR`](https://www.postgresql.org/docs/9.6/static/functions-aggregate.html)
variant on the outer join approach: 

```sql
SELECT BOOL_OR(TRUE)
FROM fruit
LEFT JOIN (
    SELECT id
    ...
```

Again, the query planner reports an identical cost:

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

We started brainstorming ways of checking for the overlap without performing
a join. One idea was to select fruits that did not exist in `category` by using
a `WHERE NOT EXISTS` condition:

```sql
SELECT id
FROM fruit
WHERE NOT EXISTS(
    SELECT 1
    FROM category
    WHERE fruit.id = category.id
    AND current = TRUE
)
```

Unfortunately, the query plan revealed that this query also required a join, in spite
of its different syntax:


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

There's some sense to this. Finding the overlap `WHERE fruit.id = category.id`
is basically a join, even if we don't use the `JOIN` keyword. Correspondingly,
the total cost is the same, although the startup cost is a little bit faster.

Our breakthrough came when we realized that we didn't actually have to know the
contents of the tables. Since every fruit can have at most one current
category, we could find the overlap by counting the rows in each table:

```sql
WITH
  fruit_cardinality AS (
    SELECT COUNT(id)
    FROM fruit
),
  category_cardinality AS (
    SELECT COUNT(id)
    FROM category
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

While it might not look like much, we've knocked off 15% of the cost! At scale,
that's a nice improvement.

Now, if we had confidence that the sequence of IDs used by the two tables was
continuous (i.e. that there were no gaps, like how we're missing a row that we
would expect for the ID `3`), we could get *even more efficient* by using the
`MAX` aggregate function instead of an expensive `COUNT`:

```sql
WITH
  fruit_cardinality AS (
    SELECT MAX(id)
    FROM fruits
  ),
  ...
```

The corresponding query plan confirms that `MAX` skips the final index scan,
doubling the performance:

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

Since we couldn't rely on the assumption of continuous IDs, however, we had to
make due with our 15% improvement. If in the future we notice that this query
continues to be a performance bottleneck, we might consider refactoring the
data model to ensure that the IDs are continuous.

Our game of *The Price Is Right: SQL Edition* nicely illustrates a hidden conundrum of the declarative paradigm: since the
machine is figuring out its own clever ways of retrieving information, we as
users can't rely on our queries being interpreted in the ways that make the
most intuitive sense to us. In our case, a join&mdash;which
felt to us like the most "relational" way of doing what we wanted&mdash;wound up
being *more expensive* than a naive, indexed table count. Luckily, the query planner is
always on hand to `EXPLAIN` it to us.

[^antiques-roadshow]: I grew up on [_Antiques Roadshow_](https://en.wikipedia.org/wiki/Antiques_Roadshow),
but it's not nearly as expressive of an analogy.

[^declarative-programming]: The line between "declarative" and a "procedural" programming is
fuzzy, of course, and definitions vary. See the [Wikipedia page for declarative
programming](https://en.wikipedia.org/wiki/Declarative_programming) for an
overview of different approaches to a definition.

[^hash-map]: For a good explanation of why Postgres would use a hash map to perform a join, see Pat
Shaughnessy's take in ["A Look at How Postgres Executes a Tiny
Join."](http://patshaughnessy.net/2015/11/24/a-look-at-how-postgres-executes-a-tiny-join)
