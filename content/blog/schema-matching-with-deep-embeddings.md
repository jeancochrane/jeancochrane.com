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
to find matches (what Rahm and Bernstein call _schema-level matching_). `address`
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

The crux of Mueller and Smola's method is to train a neural network to produce
_embeddings_ based on the distribution of the columns. An embedding is a smaller-dimensional
vector representation of the data that encodes some type of semantic meaning
that the neural network has learned to recognize. With columns converted to embeddings,
they can be clustered together using fast approximate nearest neighbor algorithms,
as described by [Muja and Lowe (2009)](https://www.researchgate.net/publication/221416047_Fast_Approximate_Nearest_Neighbors_with_Automatic_Algorithm_Configuration).
Figure 1 above shows a visualization of these clusters of embeddings projected
into two dimensions, where the relationship between distance and semantic meaning
of columns is clearer.

In Mueller and Smola's architecture, there are actually two neural networks at work: $h_{\theta}$,
which learns to produces embeddings from columns, and $g_{\psi}$, which learns to produce
an adjustment term based on how common the column's distribution is. $h_{\theta}$
and $g_{\theta}$ interact to produce probabilities $p_{ij}$ that two columns $D_i$ and $D_j$ and were produced
by the same variable:

\begin{equation} p_{ij} = e^{-D_{ij}} \end{equation}

Where:

\begin{equation} D_{ij} = (h_{\theta}(D_i) - h_{\theta}(D_j))^2 + g_{\psi}(D_i) + g_{\psi}(D_j) \end{equation}

Standard triaining rules apply: both $h_{\theta}$ and $g_{\psi}$ are trained
via stochastic gradient descent, where the loss function is cross-entropy loss
for binary classification.

In essence, Mueller and Smola's probabilities suggest that the degree of similarity between
two columns can be thought of as the squared distance between their
embeddings $(h_{\theta}(D_i) - h_{\theta}(D_j))^2$ scaled by a factor $g_{\psi}(D_i) + g_{\psi}(D_j)$
representing how common the distributions of the columns are.

### Two networks are better than one

Why train two networks? It turns out $g_{\psi}$ adds an important element by
learning to adjust for columns with common distributions.

Columns with very common sets of values, such as Boolean `True`/`False` columns, will tend to produce very
high confidence matches when only their embeddings are compared. The adjustment
factor $g_{\psi}$ learns to produce a large value in response to these types
of columns, making them categorically less likely to match. Mueller and Smola's
experiments showed that models lacking $g_{\psi}$ performed much more poorly.

### Different architectures for different data types

One major challenge facing Mueller and Smola's architecture is that the types of
data represented by different columns can vary widely. Columns can contain strings,
integers, floats, blocks of free text -- and each of these columns needs to be
legible to the networks $h_{\theta}$ and $g_{\psi}$.

The biggest hurdle involved in making heterogenous data legible to the networks
is that columns with different data types cannot be encoded and input into the network
in the same way. A column with a string data type, like our `address` column above,
needs to be encoded differently from a numeric column like `price` before being
converted to a vector that can pass through the networks. Another hurdle is that
networks with inputs of widely-varying magnitudes tend to train poorly, so even
if two columns are both numeric, they may have completely different ranges and
will be hard to compare as a result.

Mueller and Smola tackle the problem of heterogenous data types by training separate
networks for different data types. String columns that represent discrete English words
are converted to vector inputs using the [`fastText` word vector embeddings](https://fasttext.cc/)
before being fed into the networks; if a string column represents indeterminate free
text instead of discrete English words, $h_{\theta}$ and $g_{\psi}$ are instead
trained as character-level LSTM recurrent networks. Numeric data is converted to
a 32-dimensional vector representing the 32-bit representation of the number as
a form of normalization.

In all cases, $h_{\theta}$ and $g_{\psi}$ have three fully-connected hidden layers
of 300 nodes each, with ReLU activations in $g_{\psi}$ and tanh activations in
$h_{\theta}$, and where $h_{\theta}$ produces a 300-dimensional vector output and
$g_{\psi}$ produces a scalar. Thus while there are substantial differences in the input to each
network as determined by the column's data type, the networks themselves are largely
identical.

_Image TK_

Mueller and Smola don't make it clear how the data types of each column are
determined prior to encoding the input to the networks. Since the training
data for the paper was generated from [OpenML](https://www.openml.org) source data,
which provides feature type metadata for each dataset, we can assume that Mueller
and Smola used dataset metadata to determine the data types in each column.
This metadata is unlikely to exist outside of a lab context, however, so methods
of accurately approximating the data types of each column would be a necessary
improvement in order to put Mueller and Smola's work into production.

### The need for speed

While Mueller and Smola show that their network architecture outperforms other statistical
classifiers on key metrics like precision, recall, and AUC, their metric results
aren't extremely exciting. As their charts demonstrate, the embeddings approach produces
incremental imrpovements in most domains, and breakthrough improvement in only a few.

_Image TK_

To me, the key advantage of using deep embeddings for schema matching is speed.
Instead of producing pairwise classifications of columns, Mueller and Smola's method only requires
passing each column through each network once. Clustering is performed outside the network using
nearest-neighbor algorithms that don't require high-dimensional computation.

Mueller and Smola don't compare speed across different approaches, but this, to me,
is the biggest attraction of their approach. I'd love to see a follow-up paper that
compares approaches based on speed.

## Potential applications beyond schema matching
