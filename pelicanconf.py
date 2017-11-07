#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Jean Cochrane'
SITENAME = 'Jean Cochrane'

# For local development
SITEURL = ''
SPLASH_URL = '/pages/come-out.html'
PORTFOLIO_URL = '/pages/portfolio.html'
PLAY_URL = '/pages/play.html'
WRITING_URL = '/blog'
STATUS_URL = '/pages/status.html'
ARTICLE_URL = '/blog/{slug}.html'
PAGE_URL = '/pages/{slug}.html'
RELATIVE_URLS = True

WORK_CATEGORIES = ['code', 'images', 'sounds', 'words']

PATH = 'content'
STATIC_PATHS = ['static', 'pages']
ARTICLE_PATHS = ['blog']

TIMEZONE = 'America/Chicago'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = False

PAGE_ORDER_BY = 'order'
