const fetch = require("node-fetch");
const { Harmony } = require("@harmony-js/core");
const { numberToHex, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 1) {
  console.log("Usage: node scripts/vat.js <network(localnet|testnet|mainnet)>");
  process.exit(1);
}
var config = require("../../config.json")[`${args[0]}`];
const hmy = new Harmony(config.url, {
  chainType: ChainType.Harmony,
  chainId: config.chainid,
});

const contractAddr = process.env.FLIPPER;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/flip.sol:Flipper"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

// (async function () {
//   let res = await contract.methods.yank(1).send(options2);
//   console.log(res);
// })();

(async function () {
  let res = await contract.methods.file(hexlify(toUtf8Bytes("ttl")), 600).send(options2);
  console.log(res);
  res = await contract.methods.file(hexlify(toUtf8Bytes("tau")), 1200).send(options2);
  console.log(res);
})();