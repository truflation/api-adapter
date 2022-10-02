#!/bin/bash
set -v
URL_ADAPTER=${URL_ADAPTER=http://localhost:8081/}

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{
"service": "echo/python",
"data": {
"index": "top11"
}
}'

