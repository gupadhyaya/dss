const fetch = require("node-fetch");
const { Harmony } = require("@harmony-js/core");
const { numberToHex, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 2) {
  console.log(
    "Usage: node scripts/demo/keeper_tend.js <network(localnet|testnet|mainnet)> <private>"
  );
  process.exit(1);
}
var config = require("../../config.json")[`${args[0]}`];
const hmy = new Harmony(config.url, {
  chainType: ChainType.Harmony,
  chainId: config.chainid,
});
let prv = args[1];

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
    .methods.tend(2, 160, 1)
    .send(options2);
  console.log(res);
})();

// flop tend that mints mkr in the auction end
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
      JSON.parse(allJson.contracts["src/flop.sol:Flopper"].abi),
      process.env.FLOPPER
    )
    .methods.tend(0, 1, 1) // id, mkr, dai
    .send(options2);
  console.log(res);
})();