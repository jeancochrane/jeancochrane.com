title: Transactional Testing with Pytest and Flask-SQLAlchemy 
summary: Announcing a new pytest plugin for isolating tests in highly stateful Flask-SQLAlchemy apps. 
date: 2018-07-18
category: code
slug: pytest-flask-sqlalchemy-transactions
thumbnail: /static/images/blog/pytest-flask-sqlalchemy-transactions/testing.gif
tags: python; pytest; testing 
published: true


Today I'm excited to finally open-source some work I did with
[DataMade](https://datamade.us) this past spring to make testing highly-stateful
[Flask-SQLAlchemy](https://docs.pytest.org/en/latest/) apps much easier. The
result is [pytest-flask-sqlalchemy-transactions](https://github.com/jeancochrane/pytest-flask-sqlalchemy-transactions),
a plugin for the [pytest](https://docs.pytest.org/en/latest/) test runner that
allows a developer to wrap tests in a database transaction that gets rolled
back after the test exits.

Here's the gist of it:

> Some developers [discourage touching the
> database](http://www.obeythetestinggoat.com/book/chapter_hot_lava.html) in unit tests and advocate
> mocking database interactions instead, but when testing a highly-stateful web
> app like [Dedupe.io](https://dedupe.io), tests need to interact with a real database or else they
> won’t do a reasonable job of approximating the app’s core logic.
>
> When tests run updates against a real database, however, they risk violating
> test isolation, the principle that tests should be fully independent from one
> another and should not share any state. Since it would be impractical to
> create a fresh database for every test, the tests share a connection to the
> database, meaning that the updates that a test introduces can leak from test
> to test if the developer isn’t careful. To write a unit test for Dedupe.io,
> the engineering team needed to make sure that they reversed not only the
> direct updates that the test made to the database, but that they reversed any
> side effects as well.
> 
> Taking inspiration from [Django’s built-in support for transactional
> tests](https://jeancochrane.com/blog/django-test-transactions), the
> [pytest-flask-sqlalchemy-transactions](https://github.com/jeancochrane/pytest-flask-sqlalchemy-transactions)
> plugin provides comprehensive, easy-to-use pytest fixtures for ensuring test isolation in database
> transactions for Flask-SQLAlchemy apps. The plugin allows a developer to wrap
> any test in a database transaction, an isolated unit of database work that can
> be “rolled back” to reverse new changes. 

Head on over to the [DataMade blog](https://datamade.us/blog/transactional-testing)
to catch the rest. If this is your stack, I'd love to hear your feedback! You can
get me [on Twitter](https://twitter.com/jean_cochrane) or on email at `jean@this hostname`.
