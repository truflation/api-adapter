#!/bin/bash
set -v
URL_ADAPTER=${URL_ADAPTER=http://localhost:8081/}

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "truflation/at-date",
"data": {"date" : "2022-01-01", "categories": "true"},
"keypath": "categories.Personal Care products and services.yearOverYearInflation", 
"abi": "int256",
"multiplier": "1000000000000000000"
}'


#curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "truflation/at-date",
#"data": {"date" : "2022-01-01", "categories": "true"},
#"abi": "json"
#}'
