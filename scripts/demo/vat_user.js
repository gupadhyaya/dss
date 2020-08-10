const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 5) {
  console.log(
    "Usage: node scripts/vat_user.js <network(localnet|testnet|mainnet)> <addr> <private> <gem-amount> <dai-amount>"
  );
  process.exit(1);
}
var config = require("../../config.json")[`${args[0]}`];
const hmy = new Harmony(config.url, {
  chainType: ChainType.Harmony,
  chainId: config.chainid,
});
const addr = args[1];
const prv = args[2];
const gemAmount = args[3];
const daiAmount = args[4];

const contractAddr = process.env.VAT;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/vat.sol:Vat"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(prv);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

(async function () {
  var ilk = hexlify(toUtf8Bytes("HarmonyERC20"));
  let res = await contract.methods
    .frob(ilk, addr, addr, addr, -gemAmount, daiAmount)
    .send(options2);
  console.log(res);
})();
