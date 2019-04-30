title: Five Dealbreakers in Netlify Identity
summary: Netlify Identity could change the way we deploy medium-size apps, but it comes up short.
date: 2019-05-01
category: code
slug: netlify-identity-dealbreakers
tags: netlify; jamstack; serverless
published: true


I'm a big fan of Netlify. Their hosting platform has vastly simplified my experience of deploying
static sites. The core platform understands exactly what I want to do with the majority
of the static sites that I deploy: push code to a remote source, see the changes go live,
and never think about Nginx configs.

Plus, deploy previews. Netlify deploy previews changed my life.

With their Identity and Functions add-ons, Netlify is again promising to simplify my deployment
experience&mdash;this time for sites with a narrow set of dynamic features like user
login, protected views, and API calls with sensitive credentials.

The prospect of deploying simple backend features on Netlify is enormously
appealing to me. When I'm building a client project with DataMade,
the key feature that swings me to choose a server-side framework like Django or Flask
over a static site generator like Gatsby or Jekyll is almost always a limited admin interface
or a complex search that I can't perform on the client side. Being able to deploy
these features with Identity and Functions&mdash;that is, without provisioning any
servers&mdash;would be a huge win in my book.

Unfortunately, neither service is quite there yet.

In the spirit of honest feedback, here are the five dealbreakers that need to
change before I'll be ready to commit to Identity and Functions in production.

### 1. No distinction between dev, staging, and production IDPs

When you enable Netlify Identity for a site, Netlify provisions an identity
provider (IDP) instance for your site. This IDP instance hosts your users and
exposes an API that you can interact with for authentication and user management.

Unfortunately, you only get _one_ IDP per site. This means that dev, staging, and
production have to share the same instance&mdash;same users, same API.

Sharing an IDP between dev, staging, and production is a dealbreaker for me. I
should never be able to mess with production user data in dev.

### 2. No simple, out-of-the-box UI solution for Identity

Netlify currently offers only one library for integrating the Identity API into
your UI: the [`netlify-identity-widget`](https://www.npmjs.com/package/netlify-identity-widget)
component. If you don't want to use the Identity widget, you have to roll
your own authentication UI with the lower-level [GoTrue API](https://github.com/netlify/gotrue-js).

The Identity widget only really does one thing, which is to create a login/logout
button on a page that launches a combined signup/login widget. The GoTrue API,
on the other hand, is quite complex, and requires you to build your own login interface.
Neither of these solutions Just Works with minimal configuration,
something I've come to expect from Netlify.

What I want for Identity UI is a solution like [Auth0's Universal Login](https://auth0.com/docs/universal-login).
Universal Login offers a hosted login page and a robust library for directing your
users to and from login, which is well-documented for [a variety of different
frameworks](https://auth0.com/docs/quickstart/spa). Netlify's solutions, on
the other hand, are either too narrow for serious applications (the Identity widget)
or too broad save any time (the GoTrue API).

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

To me, a feature that doesn't work in dev can't be relied on in production.

### 4. Identity pricing doesn't scale reasonably

Netlify's expansive free tier is one of the reasons I love it so much. I get a
lot of useful functionality for no money at all.

When it comes to Identity, however, Netlify pricing doesn't make sense. The free
tier is limited to five invite-only users; for any more users than that, pricing
jumps to $99/mo per site.

Compare this to Auth0.

### 5. Functions are not customizable enough

## We're getting there

Netlify Functions and Identity have improved a lot in the past year. Still, these
five dealbreakers are holding me back for the foreseeable future.
