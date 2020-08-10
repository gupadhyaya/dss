const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToBN } = require("@harmony-js/utils");
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

const contractAddr = process.env.VAT;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/vat.sol:Vat"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

(async function () {
  var ilk = hexlify(toUtf8Bytes("HarmonyERC20"));
  const value = hexToBN("0xC9F2C9CD04674EDEA40000000");
  const spot = hexToBN("0x771D2FA45345AA9000000");
  
  let res = await contract.methods.init(ilk).send(options2);
  console.log(res);

  res = await contract.methods["file(bytes32,uint256)"](
    hexlify(toUtf8Bytes("Line")),
    value
  ).send(options2);
  console.log(res);
  
  res = await contract.methods["file(bytes32,bytes32,uint256)"](
    ilk,
    hexlify(toUtf8Bytes("line")),
    value
  ).send(options2);
  console.log(res);
  
  res = await contract.methods["file(bytes32,bytes32,uint256)"](
    ilk,
    hexlify(toUtf8Bytes("spot")),
    spot
  ).send(options2);
  console.log(res);
})();
