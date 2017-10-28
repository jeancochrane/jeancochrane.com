#!/bin/bash
set -ex
rsync -av --delete output/ /var/www/jeancochrane.com/run/
