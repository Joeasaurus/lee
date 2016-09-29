FROM asmaps/letsencrypt:latest
MAINTAINER Joe Eaves <joe.eaves@shadowacre.ltd.com>

RUN echo "deb http://mirrors.kernel.org/debian/ sid main" > /etc/apt/sources.list

RUN apt-get update && apt-get install -y \
	curl \
	nodejs \
	npm \
	vim \
	wget

RUN wget -O /bin/cli53 https://github.com/barnybug/cli53/releases/download/0.7.4/cli53-linux-amd64 && \
	chmod +x /bin/cli53

COPY src /opt/lee/

RUN cd /opt/lee && wget https://raw.githubusercontent.com/lukas2511/letsencrypt.sh/master/letsencrypt.sh && \
	chmod +x letsencrypt.sh
RUN cd /opt/lee && npm install

ENV AWS_ACCESS_KEY_ID XXXXX
ENV AWS_SECRET_ACCESS_KEY XXXXX
ENV CA https://acme-staging.api.letsencrypt.org/directory

EXPOSE 4004 4004
WORKDIR /opt/lee
CMD ./index.js
