#!/bin/bash
set -v
URL_ADAPTER=${URL_ADAPTER=http://localhost:8081/}

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "nuon/static-index",
"data": {"date" : "2022-07-05"},
"abi": "json"
}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "nuon/dynamic-index",
"data": {"date" : "2022-07-05"},
"abi": "json"
}'
