const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 1) {
  console.log("Usage: node scripts/vow.js <network(localnet|testnet|mainnet)>");
  process.exit(1);
}
var config = require("../../config.json")[`${args[0]}`];
const hmy = new Harmony(config.url, {
  chainType: ChainType.Harmony,
  chainId: config.chainid,
});

const contractAddr = process.env.VOW;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/vow.sol:Vow"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

(async function () {
  var ilk = hexlify(toUtf8Bytes("HarmonyERC20"));
  let res = await contract.methods.init(ilk).send(options2);
  console.log(res);
});

(async function () {
  const value = hexToBN("0x33B2E3C9FD0803CE8000000");
  let res = await contract.methods["file(bytes32,uint256)"](
    hexlify(toUtf8Bytes("sump")),
    value
  ).send(options2);
  console.log(res);
  res = await contract.methods["file(bytes32,uint256)"](
    hexlify(toUtf8Bytes("dump")),
    value
  ).send(options2);
  console.log(res);
})();

