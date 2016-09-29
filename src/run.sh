#!/usr/bin/env bash

export ZONE="$1"
shift

DOMAINS=
for d in ${@}; do
	DOMAINS="${DOMAINS[@]} -d $d.$ZONE"
done

echo "Running with $ZONE $DOMAINS"

./letsencrypt.sh -c -f ./le.r53.conf $DOMAINS
