serve:
	(cd output && python -m http.server --bind 127.0.0.1 8000)

reload:
	rm -Rf output
	pelican -o output -t theme
	make serve
