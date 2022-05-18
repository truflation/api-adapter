#!/bin/bash
set -v
URL_ADAPTER=${URL_ADAPTER=http://localhost:8082/}

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "echo",
"data": {"foo": [30, 10530, "string"]},
"abi": "ipfs"
}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{
"service": "no-service"
}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{
"service": "nft-index",
"data": {
"index": "top11"
}
}'



curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{
"service": "nft-index",
"data": { "contracts": [
"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
"0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
"0x60e4d786628fea6478f785a6d7e704777c86a7c6",
"0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b",
"0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
"0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb",
"0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7",
"0xed5af388653567af2f388e6224dc7c4b3241c544",
"0xbd4455da5929d5639ee098abfaa3241e9ae111af",
"0xe785e82358879f061bc3dcac6f0444462d4b5330",
"0x1a92f7381b9f03921564a437210bb9396471050c"
]}
}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{
"service": "nft-index",
"abi": "cbor",
"data": { "contracts": [
"0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
"0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
"0x60e4d786628fea6478f785a6d7e704777c86a7c6",
"0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b",
"0x8a90cab2b38dba80c64b7734e58ee1db38b8992e",
"0xa3aee8bce55beea1951ef834b99f3ac60d1abeeb",
"0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7",
"0xed5af388653567af2f388e6224dc7c4b3241c544",
"0xbd4455da5929d5639ee098abfaa3241e9ae111af",
"0xe785e82358879f061bc3dcac6f0444462d4b5330",
"0x1a92f7381b9f03921564a437210bb9396471050c"
]}
}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "truflation/current"}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "echo",
"data": {"foo": 1024},
"keypath": "foo",
"abi": "uint256"
}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "echo",
"data": {"foo": [1024, 2048]},
"keypath": "foo",
"abi": "uint256[]"
}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "echo",
"data": {"foo": [30, 10530, "string"]},
"keypath": "foo",
"abi": "(uint256, uint256, string)"
}'

curl -X POST -H 'Content-Type: application/json' -i $URL_ADAPTER --data '{"service": "echo",
"data": {"foo": [30, 10530, "string"]},
"keypath": "foo",
"abi": "cbor"
}'
