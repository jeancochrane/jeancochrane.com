#!/bin/bash

set -ex

uv sync --frozen
uv run pelican content -s publishconf.py

