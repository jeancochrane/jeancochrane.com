title: Where To Buy 
slug: where-to-buy 
template: work
category: code
type: work
order: 3 
summary: Find the Chicagoland neighborhood that fits your needs, based on a variety of heuristics. 
thumbnail: /static/images/work/where-to-buy/wtb-distributions.png
work_url: http://chicagobusiness.com/section/where-to-buy
code_url: https://github.com/Crains-Chicago/where-to-buy

[Where to Buy](http://chicagobusiness.com/section/where-to-buy) was
a collaboration between [Crain's Chicago Business](http://chicagobusiness.com)
and [DataMade](https://datamade.us) to help Crain's
readers find the right Chicagoland neighborhood based on their needs. I worked
with Forest Gregg to **prepare the data** for the app and **design the
UI interactions**.

We scored places based on five variables of interest:

1. High diversity
2. Good schools
3. Low crime
4. Solid real estate price growth
5. Short commutes

Users can rearrange the variables to reflect their own personal priorities and
get an updated neighborhood recommendation. They can also select from one of a few preset
profiles put together by Crain's reporters.

[![The main site page](/static/images/work/where-to-buy/wtb-main.png)
](http://chicagobusiness.com/section/where-to-buy)

![Detailed stats on Hyde Park, my hometown
neighborhood](/static/images/work/where-to-buy/wtb-detail.png)

## Data pipeline

The **data preparation pipeline** for Where to Buy is extensive. With Forest's
guidance, I put together an ETL pipeline that includes:

- Scraping PDF reports of real estate prices and transforming them into
  structured data
- Inferring stats on racial diversity and commute times using US Census data and the
  Google directions API
- [Linking crime stats](https://github.com/datamade/illinois-ucr) from the
  Illinois State Police's Uniform Crime Reports to jursidictional boundaries
- Scraping short descriptions of towns and neighborhoods from Wikipedia
- Scoring towns and neighborhoods across the five variables of interest using
  Principle Component Analysis

![Viewing scores as
distributions](/static/images/work/where-to-buy/wtb-distributions.png)

While parts of the pipeline remain closed source in order to respect the privacy
policies of certain data sources, take a look at the [`data` subdirectory on the GitHub
page](https://github.com/datamade/where-to-buy/tree/master/data) for 
a taste.

