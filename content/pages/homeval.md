title: Home Value Report
slug: homeval
template: work
category: code
type: work
order: 2
summary: A data-driven web app to explain machine learning model predictions.
thumbnail:
work_url: https://www.cookcountyassessoril.gov/home-value-report

The Home Value Report (HomeVal) is a web app whose development I led as a member
of the Data team at the Cook County Assessor's Office. HomeVal aims to **explain
the predicted sale prices that the Data team's valuation models generate** for
every home in Cook County. It does this by showing the features (home
characteristics) that a model considered when making a prediction, alongside
the characteristics of the five sales that the model scored as being most
informative for the model's decision.

There are four key components that comprise the HomeVal stack:

1. A **machine learning explainability algorithm** that considers the tree
   structure of a gradient boosted tree model, a set of training data, and a
   predicted value, returning the N observations in the training data that are
   most similar to the predicted value
2. A **static Hugo web app** that shows characteristics, values, and significant
   sales to the user, with plain-language explanations of what it all means
3. A **site generation script** that can pre-compute pages for all 1.9 million
   parcels in Cook County and upload them to AWS S3 in under two hours
4. A **CloudFront CDN** that serves the app's static files in milliseconds and
   caches common requests

HomeVal was a particularly fun project because we had the opportunity to work
hard at improving the performance of both the algorithm and the app. Our team's
Director worked with an intern to develop [the algorithm that powers the
app](https://ccao-data.github.io/lightsnip/articles/finding-comps.html),
but I got to jump in and lead the team in improving the algorithm's performance,
since it grows quadratically in time and memory with the number of observations.
We were able to cut the runtime down from days to hours by using numba for
hardware acceleration; minimizing the number of saved scores to reduce memory
consumption and lookup time; and setting up an ephemeral, on-demand cloud
compute environment to run the algorithm on beefy machines.

Once we'd gotten the performance of the explainability algorithm into an
acceptable range, we turned our attention to designing a web app that would load
nearly instantaneously without requiring heavy infrastructure, maintenance,
or monitoring. I decided to meet these requirements by designing the app as a
static site built with Hugo so that we could pre-compute a page for every parcel
in every year and push those pages to AWS S3. With all the pages stored in S3,
the app is entirely serverless, so it requires zero maintenance to run and it
can send responses in a handful of milliseconds over a CloudFront CDN.

If you'd like to see HomeVal in action, try [the Home Alone house in
2026](https://homeval.cookcountyassessoril.gov/2025/05174170200000.html).
