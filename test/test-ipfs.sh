#!/bin/bash
set -v
URL_ADAPTER=${URL_ADAPTER=http://localhost:8082/}

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "truflation/range",
"data": {"start-date" : "2021-10-10", "end-date": "2021-10-25", "interval": "day"},
"abi": "json"
}'
curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "truflation/range",
"data": {"start-date" : "2021-10-10", "end-date": "2021-10-25", "interval": "day"},
"abi": "ipfs"
}'

