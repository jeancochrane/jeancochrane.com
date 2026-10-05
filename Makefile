.PHONY: clean build build-deploy serve reload deploy
clean:
	rm -Rf output

build:
	uv run pelican -o output -t theme

build-deploy:
	uv run pelican -o output -t theme -s publishconf.py

serve:
	(cd output && uv run python -m http.server --bind 127.0.0.1 8000)

reload:
	make clean
	make build
	make serve

deploy:
	make clean
	make build-deploy
	rsync -av --delete ./output/ /var/www/jeancochrane.com/html/
