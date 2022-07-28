#!/bin/bash
set -v
URL_ADAPTER=${URL_ADAPTER=http://localhost:8081/}

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "defilama/tvl/chains",
"abi": "json"
}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "defilama/stablecoins/stablecoins",
"abi": "uint256",
"multiplier": "1000000000000000000",
"keypath": "peggedAssets.symbol=USDT.circulating.peggedUSD"
}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "defilama/stablecoins/stablecoincharts/all",
"abi": "uint256",
"multiplier": "1000000000000000000",
"data": {"id": 1},
"keypath": "date=1652313600.totalCirculating.peggedUSD"
}'


curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "nuon/dynamic-index",
"data": {"date" : "2022-07-05"},
"abi": "json"
}'
