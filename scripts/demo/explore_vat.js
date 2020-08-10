const fetch = require("node-fetch");
const { Harmony } = require("@harmony-js/core");
const { numberToHex, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 2) {
  console.log("Usage: node scripts/vat.js <network(localnet|testnet|mainnet)> <addr>");
  process.exit(1);
}
var config = require("../../config.json")[`${args[0]}`];
const hmy = new Harmony(config.url, {
  chainType: ChainType.Harmony,
  chainId: config.chainid,
});
const addr = args[1];

const contractAddr = process.env.VAT;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/vat.sol:Vat"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

(async function () {
  var ilk = hexlify(toUtf8Bytes("HarmonyERC20"));
  let res = await contract.methods.ilks(ilk).call(options2);
  console.log(res);
  
  res = await contract.methods.urns(ilk, addr).call(options2);
  console.log(res);

  res = await contract.methods.dai(addr).call(options2);
  console.log(res.toString());

  res = await contract.methods.gem(ilk, addr).call(options2);
  console.log(res.toString());

  // res = await contract.methods.sin(process.env.VOW).call(options2);
  // console.log(res);
  // process.exit(0);
})();
