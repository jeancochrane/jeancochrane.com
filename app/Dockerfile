FROM node:11-stretch-slim

COPY . /usr/local/src
WORKDIR /usr/local/src

RUN set -ex \
	&& buildDeps=" \
        python \
        make \
        build-essential \
	" \
	&& apt-get update && apt-get install -y $buildDeps --no-install-recommends \
	&& yarn install \
	&& apt-get purge -y --auto-remove $buildDeps \
	&& rm  -Rf /var/lib/apt/lists/*

ENTRYPOINT [ "yarn" ]
CMD [ "start" ]
