#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Jean Cochrane'
SITENAME = 'Jean Cochrane'

# For local development
SITEURL = ''
SPLASH_URL = '/pages/come-out.html'
PORTFOLIO_URL = '/'
PLAY_URL = '/pages/play.html'
BLOG_URL = '/blog'
ABOUT_URL = '/about.html'
ARTICLE_URL = '/blog/{slug}.html'
PAGE_URL = '/pages/{slug}.html'
RELATIVE_URLS = True

WORK_CATEGORIES = ['code', 'images', 'sounds', 'words']

# Paths
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

# Social links
GITHUB = 'https://github.com/jeancochrane'
TWITTER = 'https://twitter.com/jean_cochrane'

# Pagination
DEFAULT_PAGINATION = 10  # Max articles per page
PAGINATION_PATTERNS = (
    (1, '{base_name}/', '{base_name}/index.html'),
    (2, '{base_name}/page/{number}/', '{base_name}/page/{number}/index.html'),
)

# Order pages by a custom attribute when pulling them into a template
# (This lets us define the order we want portfolio thumbnails to appear in)
PAGE_ORDER_BY = 'order'

# Skip these
TAG_SAVE_AS = ''
CATEGORY_SAVE_AS = ''

# Save index of blog articles to a custom location
INDEX_SAVE_AS = 'blog/index.html'
ARTICLE_SAVE_AS = 'blog/{slug}.html'
