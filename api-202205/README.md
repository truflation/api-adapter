# About

The Top11 NFT is the aggregate of the top 11 NFT collections (ERC721) price indexes, including Bored Ape Yacht Club, Crypto Punks, and Mutant Ape Yacht Club.

The NFT price indexes aim to facilitate valuation, portfolio tracking, lending and borrowing, and collateralization of non-fungible tokens. NFTs have gained incredible popularity in the last two years thanks to their unique ability to transfer ownership and eternalize digital art, music, collectibles, etc., on the blockchain.

The indexes have been created by the team behind Truflation (an independent US inflation index), who are focused on bringing economic and financial metrics to the public and building a solid foundation for a decentralized, blockchain-powered economy through transparent, open-source data.

## Overview of NFT Index

The top 11 index tracks a daily and monthly price change for the top NFT collections (ERC721 tokens including wrapped ERC721 Cryptopunks).

The index includes % price change for 24h and 30days, and the market cap is calculated using a 7-day price mode– the most often occurring weekly NFT price within each collection. The Top 11 NFTs index value is benchmarked to the 1st of January 2022.

The underlying price indexes for separate NFT collections contain a mode price of the collection, its circulating supply, and a market cap (mode price \* circulating supply).

## How to use

To use this NFT index, follow Chainlink’s documentation.

Examples of smart contracts necessary to call the data feed are available on Chainlink’s official Github and our quickstart for all Truflation indexes. The quickstart offers a Rinkeby testnet walkthrough that can be easily utilized for the mainnet calls.

All contracts on Chainlink must be funded using the local utility token LINK.

## Network Details

### Ethereum Mainnet (Chain ID: 1)

- Payment amount: 0.01 LINK
- Oracle address: 0xfE2dD37BC29f5fc4E0cad8F58F4Dbf4AddD5A59A
- LINK token address: 0x514910771af9ca656af840dff83e8264ecf986ca
- Job ID(NFT Index): eb4f0d822a4c481ca88e5a3ab2fec562

### Ethereum Rinkeby Testnet (Chain ID: 4)

- Payment amount: 0.01 LINK
- Oracle address: 0x17dED59fCd940F0a40462D52AAcD11493C6D8073
- LINK token address: 0x01BE23585060835E02B77ef475b0Cc51aA1e0709
- Job ID(NFT Index): eb4f0d822a4c481ca88e5a3ab2fec562

### BNB Chain Mainnet (Chain ID: 56)

**Important**\
**The LINK provided by the [BNB Chain Bridge](https://www.bnbchain.world/en/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [converted to the official LINK token on BNB Chain using Chainlink's PegSwap service](https://pegswap.chain.link/?_ga=2.171353062.756683581.1650345653-1161789045.1649048909). ([Reference](https://docs.chain.link/docs/link-token-contracts/#bnb-chain))**

- Payment amount: 0.01 LINK
- Oracle address: 0x02a1BE5682f4Fcc941746e95f095c356A7f4D480
- LINK token address: 0x404460c6a5ede2d891e8297795264fde62adbb75
- Job ID(NFT Index): eb4f0d822a4c481ca88e5a3ab2fec562

### BNB Chain Testnet (Chain ID: 97)

- Payment amount: 0.01 LINK
- Oracle address: 0x17dED59fCd940F0a40462D52AAcD11493C6D8073
- LINK token address: 0x84b9b910527ad5c03a9ca831909e21e236ea7b06
- Job ID(NFT Index): eb4f0d822a4c481ca88e5a3ab2fec562

### Polygon Mainnet (Chain ID: 137)

**Important**\
**The LINK provided by the [Polygon (Matic) Bridge](https://wallet.polygon.technology/bridge) is not ERC-677 compatible, so cannot be used with Chainlink oracles. However, it can be [converted to the official LINK token on Polygon (Matic) using Chainlink's PegSwap service](https://pegswap.chain.link/?_ga=2.130074441.756683581.1650345653-1161789045.1649048909). ([Reference](https://docs.chain.link/docs/link-token-contracts/#polygon-matic))**

- Payment amount: 0.01 LINK
- Oracle address: 0xA96474C1A08374EFd0F3C9BC7153FDA7A6c8d9e1
- LINK token address: 0xb0897686c545045afc77cf20ec7a532e3120e0f1
- Job ID(NFT Index): eb4f0d822a4c481ca88e5a3ab2fec562

### Mumbai (Polygon) Testnet (Chain ID: 80001)

- Payment amount: 0.01 LINK
- Oracle address: 0x17dED59fCd940F0a40462D52AAcD11493C6D8073
- LINK token address: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
- Job ID(NFT Index): eb4f0d822a4c481ca88e5a3ab2fec562

### Avalanche Mainnet (Chain ID: 43114)

- Payment amount: 0.01 LINK
- Oracle address: 0xfE2dD37BC29f5fc4E0cad8F58F4Dbf4AddD5A59A
- LINK token address: 0x5947BB275c521040051D82396192181b413227A3
- Job ID(NFT Index): eb4f0d822a4c481ca88e5a3ab2fec562

### Fuji (Avalanche) Testnet (Chain ID: 43113)

- Payment amount: 0.01 LINK
- Oracle address: 0x17dED59fCd940F0a40462D52AAcD11493C6D8073
- LINK token address: 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846
- Job ID(NFT Index): eb4f0d822a4c481ca88e5a3ab2fec562
