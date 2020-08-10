const fetch = require("node-fetch");
const { Harmony } = require("@harmony-js/core");
const { numberToHex, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 3) {
  console.log(
    "Usage: node scripts/demo/keeper_bite.js <network(localnet|testnet|mainnet)> <keepr-addr> <vault-user>"
  );
  process.exit(1);
}
var config = require("../../config.json")[`${args[0]}`];
const hmy = new Harmony(config.url, {
  chainType: ChainType.Harmony,
  chainId: config.chainid,
});
let prv = args[1];
let addr = args[2];

const contractAddr = process.env.CAT;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/cat.sol:Cat"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(prv);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

// bid for the auction
(async function () {
  // let res = await hmy.contracts
  // .createContract(
  //   JSON.parse(allJson.contracts["src/vat.sol:Vat"].abi),
  //   process.env.VAT
  // )
  // .methods.hope(process.env.FLIPPER).send(options2);
  // console.log(res);
  let res = await hmy.contracts
    .createContract(
      JSON.parse(allJson.contracts["src/flip.sol:Flipper"].abi),
      process.env.FLIPPER
    )
    .methods.deal(2)
    .send(options2);
  console.log(res);
})();
