title: Paper Review: Mueller and Smola on Schema Matching with Deep Embeddings
summary: A recap of Jonas Mueller and Alex Smola's paper using learned embeddings to match columns across datasets.
date: 2019-09-23
category: code
slug: schema-matching-with-deep-embeddings
thumbnail: /static/images/blog/schema-matching-with-deep-embeddings/mueller-smola-clusters.jpg
tags: ml; ai; schema matching
published: true

_Fig. 1 from [Mueller and Smola](https://arxiv.org/pdf/1909.04844.pdf) showing clusters of similar dataset columns as classified by deep neural networks._

In [a new paper](https://arxiv.org/pdf/1909.04844.pdf) published in early
September, Jonas Mueller and Alex Smola, from the research team at Amazon Web Services,
propose a new method for matching unseen columns across data tables (a task known
as _schema matching_).

Mueller and Smola's method is as elegant as it is simple: a combination of neural networks
learns to produce low-dimensional representations of columns, also known as
embeddings, based on the distribution of the data contained in each column.
These representations can be quickly compared
to one another using standard clustering techniques, allowing the programmer to
efficiently group columns that likely refer to the same data without explicitly
knowing how the columns were produced.

In the following post, I'll provide some background on why schema matching is an
important challenge before diving into an explanation of Mueller and Smola's approach.
We'll see how their models work and think about potential applications to
data cleaning and discovery more broadly beyond the specific task of
schema matching.

## What is schema matching?

In the context of Muller and Smola's work, _schema matching_ refers to the task
of inferring the meaning of a column in a data table without knowing its origin.
Mueller and Smola summarize the task as an effort to determine the underlying
random variables represented by columns:

> Given a previously-unseen data table, we aim to automatically infer what type
> of variable was measured to generate the observations in each column.

As a simple example, imagine a data table `buildings` had a column `address` with values like `123 MAIN ST.`,
while a data table `people` had a column `street_addr` with values like
`5 W. 3rd Ave New York NY First Floor`. A person could easily tell that these two
columns had the same semantic meaning (i.e. street addresses corresponding to each record)
but it's hard to write a computer program that can make the same judgment across
a variety of different domains and data types.

Simple approaches to schema matching, as outlined by [Rahm and Bernstein
(2001)](https://dl.acm.org/citation.cfm?id=767154), compare the names of the fields
to find matches (what Rahm and Bernstein call _schema-based matching_). `address`
and `street_addr` are reasonably similar strings, so we can infer that their columns
probably have similar meaning. However, this approach breaks down when the column
names are _opaque_, or uninformative, which is often the case in large heterogenous data stores.
In these cases, we have to consider the data contained in the column, not just
its name.

Contemporary approaches to schema matching with opaque column names typically try to
compare the distributions of the data values within columns instead of (or in addition to)
the names of the columns themselves. DataMade provides a nice summary of these approaches
in the blog post [Modern Approaches to Schema
Matching (2017)](https://datamade.us/blog/schema-matching/). Mueller and Smola's principle
intervention, as we'll see, is to bring to bear neural networks to the task of
comparing distributions -- and to use those neural networks to cluster low-dimensional
encodings of the columns instead of comparing them directly.

## The method: Neural networks and deep embeddings

## Potential applications beyond schema matching
