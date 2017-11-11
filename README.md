# Jean Cochrane's portfolio site

Under rapid development. Check back soon.

## Developing

First, make a virtualenv with pip:

```console
mkvirtualenv jeancochrane.com
pip install -U -r requirements.txt
```

Next, use the Makefile to build and serve files:

```console
# Clean up the output directory, if it exists
make clean

# Create the output directory
make build

# Serve the site locally
make serve

# Recreate and serve the build (for rapid development)
make reload
```

## Deployment

SSH into the server, then:

```console
make deploy
```
