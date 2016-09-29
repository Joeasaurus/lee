## LetsEncrypt as a Service

*Note*: Currently running against the LE staging server

This is a small docker container designed to take authenticated requests for domains, and use Route53 with the DNS-01 challenge to aquire SSL certs for them from LetsEncrypt.

Using the DNS-01 challenge allows us to aquire certificates on behalf of requesters, without any requirements on their part to provide the challenge themselves, at the domain endpoint. This means for instance, hosts internal to a corporate firewall could acquire legitimate public SSL certificates.

The container will generate certificates for dev.cloud.displaylink.com by default, if you give it the right AWS keys. Simply build the contrainer and then run it, as so:

 $ docker build . # Will give you an image back like c2778532b288
 $ docker run -i -t docker run -t -i \
 	-e AWS_ACCESS_KEY_ID=XXXXXXXXXX \
	-e AWS_SECRET_ACCESS_KEY=YYYYYYYYYY \
	<Image ID>

If you want to run it for another domain/zone, get in to the container with bash and run the command manually. The following will get certs for dev.your.zone.here and joes-mac.your...

$ docker run -i -t 38421475415e /bin/bash
imageId$ cd /opt/lee && ./run.sh your.zone.here dev joes-mac
