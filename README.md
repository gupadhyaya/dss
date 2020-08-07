
# Harmony Deployment of Multi Collateral Dai

Testnet contracts
```
VAT=0x01b93dbdca395b0583b8ca444b8c63d2f4f5963f
CAT=0x9266ddef5092d6819826bcbb92c9147a5e107299
SPOTTER=0x54977b38f2dc81114b1f316892e7f3965826ab63
FLIPPER=0x73181521461f7e3b6434fe8a9e4c37988d13db98
GEM=0xb4f43907dbd299782d0f965a045432c17ca8571e
GEMJOIN=0x617924ed75703447812bc757e76d07d7ab0c1f5f
DAI=0x3c65027ec4bc1f70fec681525781ea7d6f373d8f
DAIJOIN=0x17e7edeba92b19beb4e648414fcb79bfdd456d92
FLAPPER=0x9f5c59669cac5bf6a6bb69f9131a11cbb5ac16b4
FLOPPER=0x09769cd34fd01d7b89f10d14158547540bfedfc2
VOW=0x31272231a5ed30978981d4b4609ca2234d09e92a
MKR=0xe42d81bb68a59567d7a714fcdca087078d80bcc7
```

1. Fund user account some gems (need admin private key for the gem contract, ask ganesh)
```
node scripts/demo/fund_gem.js <addr-to-fund> <amount>
```

2. Creating vault (or borrow): collateralize gems to obtain dais
```
node scripts/demo/borrow.js <addr> <collateral-amount> <dai-amount>
```

3. Exiting vault: return dais to get back gems
```
node scripts/demo/exit.js <addr> <collateral-amount> <dai-amount>
```

You can check balance before and after steps 2 & 3 using
```
node scripts/demo/balance.js <addr>
```
========================================================================

# Multi Collateral Dai

This repository contains the core smart contract code for Multi
Collateral Dai. This is a high level description of the system, assuming
familiarity with the basic economic mechanics as described in the
whitepaper.

## Additional Documentation

`dss` is also documented in the [wiki](https://github.com/makerdao/dss/wiki) and in [DEVELOPING.md](https://github.com/makerdao/dss/blob/master/DEVELOPING.md)

## Design Considerations

- Token agnostic
  - system doesn't care about the implementation of external tokens
  - can operate entirely independently of other systems, provided an authority assigns
    initial collateral to users in the system and provides price data.

- Verifiable
  - designed from the bottom up to be amenable to formal verification
  - the core cdp and balance database makes *no* external calls and
    contains *no* precision loss (i.e. no division)

- Modular
  - multi contract core system is made to be very adaptable to changing
    requirements.
  - allows for implementations of e.g. auctions, liquidation, CDP risk
    conditions, to be altered on a live system.
  - allows for the addition of novel collateral types (e.g. whitelisting)


## Collateral, Adapters and Wrappers

Collateral is the foundation of Dai and Dai creation is not possible
without it. There are many potential candidates for collateral, whether
native ether, ERC20 tokens, other fungible token standards like ERC777,
non-fungible tokens, or any number of other financial instruments.

Token wrappers are one solution to the need to standardise collateral
behaviour in Dai. Inconsistent decimals and transfer semantics are
reasons for wrapping. For example, the WETH token is an ERC20 wrapper
around native ether.

In MCD, we abstract all of these different token behaviours away behind
*Adapters*.

Adapters manipulate a single core system function: `slip`, which
modifies user collateral balances.

Adapters should be very small and well defined contracts. Adapters are
very powerful and should be carefully vetted by MKR holders. Some
examples are given in `join.sol`. Note that the adapter is the only
connection between a given collateral type and the concrete on-chain
token that it represents.

There can be a multitude of adapters for each collateral type, for
different requirements. For example, ETH collateral could have an
adapter for native ether and *also* for WETH.


## The Dai Token

The fundamental state of a Dai balance is given by the balance in the
core (`vat.dai`, sometimes referred to as `D`).

Given this, there are a number of ways to implement the Dai that is used
outside of the system, with different trade offs.

*Fundamentally, "Dai" is any token that is directly fungible with the
core.*

In the Kovan deployment, "Dai" is represented by an ERC20 DSToken.
After interacting with CDPs and auctions, users must `exit` from the
system to gain a balance of this token, which can then be used in Oasis
etc.

It is possible to have multiple fungible Dai tokens, allowing for the
adoption of new token standards. This needs careful consideration from a
UX perspective, with the notion of a canonical token address becoming
increasingly restrictive. In the future, cross-chain communication and
scalable sidechains will likely lead to a proliferation of multiple Dai
tokens. Users of the core could `exit` into a Plasma sidechain, an
Ethereum shard, or a different blockchain entirely via e.g. the Cosmos
Hub.


## Price Feeds

Price feeds are a crucial part of the Dai system. The code here assumes
that there are working price feeds and that their values are being
pushed to the contracts.

Specifically, the price that is required is the highest acceptable
quantity of CDP Dai debt per unit of collateral.


## Liquidation and Auctions

An important difference between SCD and MCD is the switch from fixed
price sell offs to auctions as the means of liquidating collateral.

The auctions implemented here are simple and expect liquidations to
occur in *fixed size lots* (say 10,000 ETH).


## Settlement

Another important difference between SCD and MCD is in the handling of
System Debt. System Debt is debt that has been taken from risky CDPs.
In SCD this is covered by diluting the collateral pool via the PETH
mechanism. In MCD this is covered by dilution of an external token,
namely MKR.

As in collateral liquidation, this dilution occurs by an auction
(`flop`), using a fixed-size lot.

In order to reduce the collateral intensity of large CDP liquidations,
MKR dilution is delayed by a configurable period (e.g 1 week).

Similarly, System Surplus is handled by an auction (`flap`), which sells
off Dai surplus in return for the highest bidder in MKR.


## Authentication

The contracts here use a very simple multi-owner authentication system,
where a contract totally trusts multiple other contracts to call its
functions and configure it.

It is expected that modification of this state will be via an interface
that is used by the Governance layer.
