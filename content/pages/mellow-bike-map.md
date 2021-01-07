title: Mellow Bike Map
slug: mellow-bike-map
template: work
category: code
type: work
order: 2
summary: A web app and routing API for finding safe, chill bike routes.
thumbnail: /static/images/work/mellow-bike-map/mbm.png
work_url: https://mellowbikemap.com
code_url: https://github.com/jeancochrane/mellow-bike-map


I built Mellow Bike Map in collaboration with [Bea Malsky](https://beamalsky.fyi/)
and [Kalil Smith-Nuevelle](https://kalil.fyi/) as an attempt to improve on Google Maps'
biking directions. The basic premise of Mellow Bike Map is that **biking on side
streets is safer and more comfortable than biking on commercial arteries**, whether
or not they have bike lanes.

Bike lanes on big streets are prioritized in a number of different ways. Google Maps
weights them heavily in its bike directions, for example, and bikeability indexes
like the [Bike Score](https://www.walkscore.com/bike-score-methodology.shtml) often
consider mileage of bike lanes to be a proxy for bike safety. However, in the absence
of full protection via concrete barriers, bike lanes on commercial arteries encourage
cyclists to share crowded roads with loud, dirty, high-speed traffic.

Based on the Chicago Reader's [Mellow Chicago Bike
Map](https://www.chicagoreader.com/chicago/citywide-mellow-chicago-bike-map/Content?oid=81151025),
Mellow Bike Map instead emphasizes a different kind of street as the ideal bike route:
side streets that are low-speed, infrequently used, and that feature traffic calming
infrastructure like speed bumps and roundabouts.

You can start a route from your current position if you grant the app location access,
or you can manually search for start and end addresses. The app will prioritize
off-street bike paths, then mellow side streets, then main streets with bike lanes,
and then everything else.

![A user entering a route on Mellow Bike Map](/static/images/work/mellow-bike-map/search.gif)

The directions engine uses [pgRouting](https://pgrouting.org/) on top of map
data from [Open Street Map](https://www.openstreetmap.org/) which we transformed into
a routing graph using [osm2pgrouting](https://github.com/pgRouting/osm2pgrouting).
Building on top of pgRouting gave us a great routing algorithm out of the box
but it meant that we had to build an interface to manually tag every mellow OSM way,
since the Reader's Mellow Chicago Bike Map is just a collection of hand-drawn
polygons and can't be automatically tied to OSM ways. Luckily, Bea and I had
previously collaborated on [django-geomultiplechoice](https://github.com/datamade/django-geomultiplechoice),
which we were able to use to quickly build a simple interface to manually tag
mellow ways.

![Selecting mellow ways on the Mellow Bike Map tagging interface](/static/images/work/mellow-bike-map/mapping.gif)

The manually-tagged mellow ways work surprisingly well but they aren't
transferable to other cities and they introduce a major barrier to entry.
For the next version we're working on using data on
street widths, speed limits, and traffic calming infrastructure to automate
the task of determining which streets are mellow.

Do you think our map is missing a good route? Or do you want to bring
Mellow Bike Map to your city? [Get in touch with me on
Twitter](https://twitter.com/jean_cochrane) and I'd be glad to help.
