const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 2) {
  console.log("Usage: node scripts/rely_flip.js <network(localnet|testnet|mainnet)> <addr>");
  process.exit(1);
}
var config = require("../../config.json")[`${args[0]}`];
const hmy = new Harmony(config.url, {
  chainType: ChainType.Harmony,
  chainId: config.chainid,
});
const addr = args[1];

const contractAddr = process.env.FLIPPER;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/flip.sol:Flipper"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

(async function() {
  let res = await contract.methods.rely(addr).send(options2);
  console.log(res);
})();
