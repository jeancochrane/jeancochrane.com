title: CCAO Data Architecture
slug: ccao-data-architecture
template: work
category: code
type: work
order: 3
summary: Data engineering and MLOps at the Cook County Assessor's Office.
thumbnail: /static/images/blog/ccao-data-architecture/dataflow-diagram.png
work_url: https://ccao-data.github.io/blog/posts/data-architecture/

While my official job titles during my time on the [Data team at the Cook County
Assessor's Office (CCAO)](https://ccao-data.github.io/) have technically been
"Senior Data Scientist" and "Interim Director of Data Science", my primary
role on the team has actually been to manage the design and implementation
of the infrastructure that supports our data science and analytics work.
(A common government story: "data engineer" is not a job category at the CCAO,
and creating the category would take a huge amount of time and effort, so I got
hired as a "data scientist" with the understanding that I would spend most of
my time doing data engineering.)

Over time, our data systems have matured to the point that we can move quickly
in response to shifting organizational priorities without worrying much about
budget or infrastructure. We run all of our models in parallel on ephemeral
batch compute environments in the cloud; we manage our Athena data lake through
dbt and GitHub Actions, with CI/CD performing the bulk of the QC and deployment
necessary to push changes to the lake; and we record all of our cloud resources
in a Terraform project, ensuring that all changes get the proper review and
approval. In general, we only pay for the resources we use, and the services we
use are either cheap or free-and-open-source.

This data architecture makes it easy for us to, say, QC a fresh batch of sales
and rerun our annual valuation model using the new training data, or migrate a
manual QC process into Tableau so that subject-matter experts don't need to run
16 hefty queries by hand whenever they want to gut check assessed values before
certifying them. It also allows us to run automated tests to ensure the
integrity of our source data, which is critical given the lack of constraints
in the CCAO's source-of-truth database.

Recently, I had the opportunity to spend some time documenting our team's data
architecture for the benefit of other lean public-sector data teams. Head over
to the CCAO Data team blog to read [the full
post](https://ccao-data.github.io/blog/posts/data-architecture/).
