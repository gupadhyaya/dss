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

const contractAddr = process.env.CAT;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/cat.sol:Cat"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

(async function () {
  var ilk = hexlify(toUtf8Bytes("HarmonyERC20"));

  let res = await contract.methods["file(bytes32,bytes32,address)"](
    ilk,
    hexlify(toUtf8Bytes("flip")),
    process.env.FLIPPER
  ).send(options2);

  res = await contract.methods["file(bytes32,bytes32,uint256)"](
    ilk,
    hexlify(toUtf8Bytes("chop")), // liquidation penalty
    1
  ).send(options2);
  console.log(res);

  res = await contract.methods["file(bytes32,bytes32,uint256)"](
    ilk,
    hexlify(toUtf8Bytes("lump")), // liquidation penalty
    200
  ).send(options2);
  console.log(res);

  res = await contract.methods["file(bytes32,address)"](
    hexlify(toUtf8Bytes("vow")),
    process.env.VOW
  ).send(options2);

  console.log(res);
})();
