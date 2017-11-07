.PHONY: clean build serve reload
clean:
	rm -Rf output

build:
	pelican -o output -t theme

serve:
	(cd output && python -m http.server --bind 127.0.0.1 8000)

reload:
	make clean
	make build
	make serve
