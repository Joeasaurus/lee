#!/usr/bin/env nodejs
'use strict';

var util    = require('util');
var spawn   = require('child_process').spawn;
var auth    = require('basic-auth');
var express = require('express');

var app = express();

app.get('/:zone', function (req, res) {
    var credentials = auth(req);

    if (!credentials || credentials.name !== 'user' || credentials.pass !== 'secret') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
        return 1;
    }

    var domains = req.query.domains;
    if (!domains || domains.length <= 0) {
        res.statusCode = 400;
        res.end('Must supply ?domains[]=');
        return 1;
    }

    var spawn_parameters = ["-c", "-f", "./le.r53.conf"];
    var spawn_options = {
        "shell": "/bin/bash",
        "env": {
            "PATH": process.env.PATH,
            "CA": process.env.CA,
            "ZONE": req.params.zone,
            "AWS_ACCESS_KEY_ID": process.env.AWS_ACCESS_KEY_ID,
            "AWS_SECRET_ACCESS_KEY": process.env.AWS_SECRET_ACCESS_KEY
        }
    };

    for (var domain in domains) {
      spawn_parameters.push("-d");
      spawn_parameters.push(domains[domain] + "." + req.params.zone);
    }

    var child = spawn("./letsencrypt.sh", spawn_parameters, spawn_options);

    child.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    child.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      res.end(req.params);
    });
});

app.listen(4004, function () {
  console.log('Lee listening on port 4004!');
});

// export ZONE="$1"
// shift
//
// DOMAINS=
// for d in ${@}; do
// 	DOMAINS="${DOMAINS[@]} -d $d.$ZONE"
// done
//
// echo "Running with $ZONE $DOMAINS"
//
// ./letsencrypt.sh -c -f ./le.r53.conf $DOMAINS
