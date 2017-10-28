#!/bin/bash

set -ex

export VIRTUALENV=/home/jean/.virtualenvs/jeancochrane.com/bin

$VIRTUALENV/pip install -U -r requirements.txt
$VIRTUALENV/pelican content -s publishconf.py

