title: Transaction Types in Django Tests
summary: Django provides two classes for running tests in transactions: `TestCase` and `TransactionTestCase`. What's the difference? 
date: 2018-01-30
slug: django-test-transactions
thumbnail: /static/images/blog/django-test-transactions/transactions.jpg
category: code
tags: testing; transactions; django
published: true


<div class="text-center">
   <p class="small"><em>Illustration by
        <a href="https://www.flickr.com/photos/adambrock/247810564/in/photolist-FafBgf-nU6rW-9nJT9A-Z2Hjh7-nBjevj-9CwW5a-Ya9gqe-9pkk7Y-bu7Gss-9tc1kA-cVDQQ1-cF6n5b-4fRkkB-2nN82-h3kLi7-GKQUmP-hLgrEm-8t9tf8-9dgKMr-6DWVpW-7uWjeo-66Aee9-deQNwp-eZNCde-h3ZiBo">Adam Brock</a>,
        licensed
        <a href="https://creativecommons.org/licenses/by-nc/2.0/">CC BY-NC 2.0</a>.</em></p>
</div>

One of the best parts about testing in [Django](https://www.djangoproject.com/)
is the built-in testing tools that the framework provides. Compared to smaller, more modular frameworks like
[Flask](http://flask.pocoo.org/), Django offers lots of neat utilities out of
the box. Some of the my favorite tools are the **built-in database transactions
in tests**.

Quick background: a *transaction* is a term that describes one
"unit of work" on a database. Say, for example, that a customer wants to buy
a widget off your website. When they order a widget, you might want to save their
order information in the `customer` table, and decrement the inventory in the
`widget` table. Crucially, **both of those things need to happen
simultaneously**: if the order fails to go through, the inventory shouldn't
decrement. To make sure that happens, we can wrap the two changes (update
`customers`, decrement `widgets`) in one transaction, and if one change fails,
the other will get *rolled back*, meaning that it won't ever enter the database. Since all
of the changes in a transaction must succeed or else none of them will succeed,
database transactions are [*atomic*](https://en.wikipedia.org/wiki/Atomicity_(database_systems)).

## Why use transactions in tests?

Opinionated programmers have argued for and against the idea that unit tests
should touch the database at all.[^unit-vs-integration] Their points are well taken, but
it's an unfortunate fact of life that we often need to test that our apps are interacting with their databases
properly.

If you're going to touch the database in a test, one major benefit that transactions
provide is that **you can edit
the database while maintaining test isolation.** Whether or not your unit tests
touch the database, they should always be *isolated*: if you run them in
a different order, nothing should be different. If tests can change the
state of the database in unexpected ways, they can become non-deterministic and hard to
maintain, since you can't be certain of the environment that your tests will run in. If
one test tries to create five `customers`, say, and then verify that
a `Customer.count()` method works properly, your count will be off if a test
somewhere else accidentally creates a `customer` object without cleaning it up
(for example, during a test for the `sign-up` route).

Transactions provide nice benefits for testing, but it's important to note that
not all transactions are the same. A "transaction" is an **abstraction, not an
implementation**: there are many ways to make sure that two things happen
simultaneously in a database. This is why Django offers two types of test cases
with different transaction implementations.

## Two types of transactions: `TestCase` and `TransactionTestCase`

The two transaction-oriented test cases in Django are
[`TestCase`](https://docs.djangoproject.com/en/2.0/topics/testing/tools/#testcase)
and
[`TransactionTestCase`](https://docs.djangoproject.com/en/2.0/topics/testing/tools/#django.test.TransactionTestCase).
Both test cases will wrap all of your tests in a database transaction, but they
implement these transactions differently&mdash;with important consequences
for your tests.

`TestCase` achieves isolation by wrapping tests in transaction blocks,
and rolling back any changes that were made before tearing down the test. The critical point here is that
*updates never touch the database at all.* At no point in the test will any
changes reach the database. This means your tests will be **lightning fast**,
but with **no observable changes to your database**.

`TransactionTestCase`, on the other hand, achieves isolation by updating
tables and truncating them when tearing down the test. In contrast to
`TestCase`, updates *will* touch the database during the test&mdash;they'll
just get deleted before the test exits. With this implementation, your tests
will be **much slower**, but they'll **allow you to see changes in the
database.** 

## Why use one test case instead of the other?

The different implementations of transactions in `TestCase` and
`TransactionTestCase` provide subtle but important advantages for testing
data-intensive apps. Using **`TestCase`**
allows your tests to be fast, but you won't be able to query 
changes to the database. Using **`TransactionTestCase`** will make your tests
much slower&mdash;maybe even by a factor of 10&mdash;but you'll be able to
query changes as you go. Together, they allow you to **optimize the level of
database access in your tests**.

The two different types of tests came in handy when I was writing tests for [The
Openness Project](https://opennessproject.com/), an app for scrutinizing
campaign finance in New Mexico. The Openness Project sits on top of a large
database, with millions of rows and a highly-normalized structure. But for the
purposes of testing, I wanted to avoid the time-intensive task of loading
huge amounts of data into a database.

### Using `TestCase` for high-speed unit tests

To make my tests as fast as possible I avoided big fixtures, choosing instead to write a [setup
method](https://github.com/datamade/openness-project-nmid/blob/32a86d43470ce0b87d57d9fe8c4aea0722cb3067/camp_fin/tests/conftest.py#L22)
that would create some dummy data that I could test against:

```python
class FakeTestData(object):
    '''
    Mixin to set up some fake data for testing purposes.
    '''
    @classmethod
    def races(cls):

        first_entity = Entity.objects.create(user_id=1)
        second_entity = Entity.objects.create(user_id=2)
        third_entity = Entity.objects.create(user_id=3)
        fourth_entity = Entity.objects.create(user_id=4)

        first_party = PoliticalParty.objects.create(name='Democrat')
        second_party = PoliticalParty.objects.create(name='Republican')
        third_party = PoliticalParty.objects.create(name='Green')

        cls.parties = (first_party, second_party, third_party)

        # ... You get the picture
```

Then, I mixed in the method for my tests and inherited from `TestCase` to wrap
each test in a rolled-back transaction:

```python
class TestCampaign(TestCase, FakeTestData):
    '''
    Test methods of the `Campaign` model.
    '''
    @classmethod
    def setUpClass(cls):
        '''
        Generate some fake data.
        '''
        cls.races()

    def test_campaign_funds_raised(self):
        for campaign, filing in zip(self.campaigns, self.filings):
            self.assertEqual(campaign.funds_raised(),
                             sum(flg.total_contributions for flg in filing))
```

This setup worked great! Even with the large number of new objects that `FakeTestData` created, the tests ran
very quickly&mdash;thanks in no small part to the Django test framework's
[`--keepdb`](https://docs.djangoproject.com/en/2.0/ref/django-admin/#cmdoption-test-keepdb)
option for preserving the test database between test runs:

```
> python manage.py test camp_fin.tests.test_unit.TestCampaign -k

Using existing test database for alias 'default'...
...
----------------------------------------------------------------------
Ran 4 tests in 0.048s

OK
```

Everything hit a snag, however, when I realized **I needed to interact directly with
the database**. By writing a function method to count the total funds raised
by a campaign, a method that ran a raw SQL query for performance reasons, I wound
wound up collapsing the abstraction layer between the ORM and the database.

Here's how it went down: getting the total amount of funds raised by a campaign 
meant that the ORM would have to join up every transaction associated with
a campaign in order to count up their total contributions. I designed the sum of
funds by campaign as a simple method on the `Campaign` model:

```python
class Campaign(models.Model):

    def funds_raised(self):
        '''
        Total funds raised in a given filing period. (Simplified for
        illustration purposes.)
        '''
        return sum(filing.total_contributions for filing in self.filing_set.all())
```

While this implementation of `funds_raised` was nice and simple, its reliance
on the Django ORM was leading to thousands of joins in the ORM and painfully slow request/response cycles. To
fix the sluggish queries, I changed up the implementation to run a raw SQL query
directly against the database, which could return the total count in a matter of
milliseconds:

```python
class Campaign(models.Model):

    def funds_raised(self):
        '''
        Total funds raised in a given filing period. (Simplified for
        illustration purposes.)
        '''
        entity_id = self.candidate.entity.id

        sum_contributions = '''
            SELECT COALESCE(SUM(amount), 0)
            FROM contributions_by_month
            WHERE entity_id = %s
        '''

        cursor = connection.cursor()
        cursor.execute(sum_contributions, [entity_id])
        amount = cursor.fetchone()[0]

        return amount
```

The speed problem was fixed, but I had introduced a new problem: **The tests
were failing, because now they relied on queryable rows existing in the
database.** When `TestCase` runs the `FakeTestData.races()` classmethod to
generate data, it doesn't actually commit any of the new objects to the
database&mdash;it holds them in a *nested transaction* that gets rolled back when
the last test method exits. `Campaign.funds_raised()` expected `FakeTestData.races()`
to generate rows in `contributions_by_month`, but thanks to the transaction,
no such rows existed.

### Using `TransactionTestCase` to test direct database access

Here was where `TransactionTestCase` saved me. In contrast to `TestCase`,
`TransactionTestCase` really does commit to the database all changes incurred by a test or
a setup method; it just truncates those tables after each test
exits to make sure the context of the test is one "transaction," or one atomic unit.
Switching test cases required a minor refactor, to use unittest's [`setUp`
method](https://docs.python.org/3/library/unittest.html#unittest.TestCase.setUp)
to set up test context before each test, since `TransactionTestCase` truncates the 
tables at the end:

```python
class TestCampaign(TestCase, FakeTestData):
    '''
    Test methods of the `Campaign` model.
    '''
    @classmethod
    def setUp(cls):
        cls.races()
```

Now, the tests could directly query the database!

There was only one downside: **switching to `TransactionTestCase` slowed the
tests down dramatically.** Note the difference in timing:

```
> python manage.py test camp_fin.tests.test_unit.TestCampaign -k

Using existing test database for alias 'default'...
....
----------------------------------------------------------------------
Ran 4 tests in 5.909s

OK
```

Two factors were contributing to the newly-sluggish tests: not only did tests
actually have to **commit and remove changes to the database**, a legendary
locus of performance bottlenecks, but they had to do this **at the start and
end of every single test**, thanks to the switch from the class-scoped
`setUpClass` method to the function-scoped `setUp` method.

### The best of both worlds: mixing `TestCase` and `TransactionTestCase`

The final synthesis required recognizing that `TestCase` and
`TransactionTestCase` were useful for two separate purposes: unit and
integration testing.

`TestCase` fulfilled the dreams of my unit tests: it ran tests at ultra-high
speeds, without touching the database at all, while still making new model
instances available for testing the API. `TransactionTestCase`, on the other
hand, met the harsh reality of my integration tests: it allowed methods to
query the database directly without having to worry about altering state
for unrelated tests.

In the end, I split tests up into two harnesses,
[`test_unit`](https://github.com/datamade/openness-project-nmid/blob/32a86d43470ce0b87d57d9fe8c4aea0722cb3067/camp_fin/tests/test_unit.py) and
[`test_integration`](https://github.com/datamade/openness-project-nmid/blob/32a86d43470ce0b87d57d9fe8c4aea0722cb3067/camp_fin/tests/test_integration.py), with separate custom test cases for each&mdash;`StatelessTestCase` and
`DatabaseTestCase`:

```python
class StatelessTestCase(TestCase, FakeTestData):
    '''
    Test class that does not commit changes to the database. Inherits from TestCase so that
    every test runs in a rolled-back transaction.
    '''
    @classmethod
    def setUpTestData(cls):
        cls.races()


class DatabaseTestCase(TransactionTestCase, FakeTestData):
    '''
    Test class that *does* commit changes to the database. Inherits from
    TransactionTestCase so that all changes are committed during the test,
    and rolled back via `TRUNCATE` when the test is done.
    '''
    @classmethod
    def setUp(cls):
        cls.races()
```

For tests that don't need database access, `StatelessTestCase` can inherit from
`TestCase` to provide a high-speed test environment. For all other tests,
`DatabaseTestCase` will inherit from `TransactionTestCase` to make sure that
isolation is enforced.

Leave it to Django to have two separate test cases for dealing with
transactions&mdash;and for both of them to prove to be huge
timesavers, either separately or in concert.[^read-more] 

[^unit-vs-integration]: For more on the (hotly contested) theories of database
access in tests, see Harry Percival's [Fast Tests, Slow Tests, and Hot
Lava](http://www.obeythetestinggoat.com/book/chapter_hot_lava.html).

[^read-more]: `TestCase` and `TransactionTestCase` are only two among many different testing
utilities for Django. To see what's possible, I recommend [Django's excellent
testing documentation](https://docs.djangoproject.com/en/2.0/topics/testing/tools/#django.test.TestCase).

