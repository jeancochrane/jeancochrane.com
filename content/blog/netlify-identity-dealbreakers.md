title: Four Dealbreakers in Netlify Identity
summary: Netlify Identity could revolutionize the way I deploy medium-size apps, but for now, it comes up short.
date: 2019-05-01
category: code
slug: netlify-identity-dealbreakers
thumbnail: /static/images/blog/netlify-identity-dealbreakers/netlify-logo.png
tags: netlify; jamstack; serverless
published: true


I'm a big fan of [Netlify](https://www.netlify.com/). Their hosting platform,
which  goes by the name [Netlify Build](https://www.netlify.com/products/build/),
revolutionized my experience of deploying static sites. Netlify Build understands
exactly what I want to do with the majority of the static sites that I deploy: push code
to a remote repo, see the changes go live, and never think about Nginx configs.

Plus, deploy previews. Deploy previews basically changed my life.

With their [Identity and Functions
add-ons](https://www.netlify.com/blog/2018/03/29/jamstack-architecture-on-netlify-how-identity-and-functions-work-together/),
Netlify is again promising to revolutionize my deployment
experience&mdash;this time for sites with simple dynamic features like user
login, protected views, and API calls with sensitive credentials.

The prospect of deploying simple backend features on Netlify is enormously
appealing to me. When I'm building a client project with [DataMade](https://datamade.us),
the key feature that swings me to choose a server-side framework like Django or Flask
over (or in addition to) a static site generator like Gatsby or Jekyll is almost always
the requirement of a limited admin interface
or a complex search that I can't perform on the client side. Being able to deploy
these features with Identity and Functions&mdash;that is, without provisioning any
servers&mdash;would be a huge win in my book.

Unfortunately, Identity isn't quite ready for prime time yet, and the whole
experience suffers.

In the spirit of honest feedback, here are four dealbreakers that need to
change before I'll be ready to forget Django and commit to Identity with
Functions in in production.

### 1. No distinction between dev, staging, and production IDPs

When you enable Netlify Identity for a site, Netlify provisions an identity
provider (IDP) instance for your site. This IDP instance hosts your users and
exposes an API that you can interact with for authentication and user management.

Unfortunately, you only get _one_ IDP per site. This means that dev, staging, and
production have to share the same instance&mdash;same users, same API.

Sharing an IDP between dev, staging, and production is a dealbreaker for me. No
one on my team should ever be able to mess with production user data in dev.

### 2. No simple, out-of-the-box UI solution for Identity

Netlify currently offers only one library for bootstrapping a UI to interact with
the Identity API: the [`netlify-identity-widget`](https://www.npmjs.com/package/netlify-identity-widget)
component. If you don't want to use the Identity widget, you have to roll
your own authentication UI with the lower-level [GoTrue API](https://github.com/netlify/gotrue-js).

The Identity widget only really does one thing, which is to create a login/logout
button on a page that launches a combined signup/login widget. The GoTrue API,
on the other hand, is a fully-featured authentication API, and requires you to build
out a custom interface. Neither of these solutions Just Works with minimal configuration,
a quality I've come to expect from Netlify.

What I want for Identity UI is a solution like [Auth0's Universal Login](https://auth0.com/docs/universal-login).
Universal Login offers a hosted login page and a robust library for directing your
users to and from login, which is well-documented for [a variety of different
frameworks](https://auth0.com/docs/quickstart/spa). Netlify's solutions, on
the other hand, are either too narrow for serious applications (the Identity widget)
or too broad save me any time (the GoTrue API).

### 3. Identity and Functions integration doesn't work in development

These days, there are a lot of companies selling IDP and serverless code execution
solutions. Integrating the two solutions should be the feature that sets Netlify
apart.

On paper, Netlify Functions are supposed to [decode and expose Identity claims
for logged-in users by default](https://www.netlify.com/docs/functions/#identity-and-functions).
This integration promises to allow Functions to work with user metadata without
having to take a second trip to the Identity API, as long as an Identity token is
passed in via an `Authorization` header.

Unfortunately, I don't actually know if this integration works as expected, because it
doesn't work in dev. The `netlify-lambda` package only emulates Function execution
in local development, meaning it can't interact with a live Identity instance.
As far as I know, this discrepancy is only documented in a [blog post by
a Netlify developer](https://www.gatsbyjs.org/blog/2018-12-17-turning-the-static-dynamic/#bonus-points-authenticated-lambda-functions-for-your-gatsby-app).

If a feature doesn't work in dev, I can't rely on it in production.

### 4. Identity pricing doesn't scale reasonably

Netlify Build's [expansive free tier](https://www.netlify.com/pricing/) is one of the
reasons I love it so much. I get a lot of useful CI/CD features for basically
no money at all.

When it comes to Identity, however, Netlify pricing doesn't make sense. The free
tier is limited to just five invited users (as opposed to self-service signups,
which get a more liberal 1,000 users in the free tier). Any more than five invited
users and pricing jumps to $99/mo per site.

In a typical DataMade client app, we usually only want to create a few admin
users that can access protected views. At $99/mo, it's easier for us to just roll
our own authentication with Django and eat the cost of hosting. Plus, Django gives
us a solid authentication UI out of the box, with practically no configuration.

## Netlify can and will do better

There's a lot to like about Netlify Identity and Functions. Functions are by
far the easiest way I've deployed to AWS Lambda, and Identity provides a more straightforward
experience than competitors like Auth0. At this point the services are [less than
two years old](https://www.netlify.com/blog/2017/09/07/introducing-built-in-identity-service-to-streamline-user-management/)
and they've already come a long way.

I'm only so critical of Identity because I know that Netlify can and will do better. When
Netlify finally nails these four features in Identity, I'll be ready to ditch
Django for the JAMStack&mdash;even in dynamic production apps.

Think I missed something here? Has Netlify already fixed these problems? I'd
love to be proven wrong. Reach out to me [on Twitter](https://twitter.com/jean_cochrane)
if you think I got something wrong I'll update the post accordingly.
