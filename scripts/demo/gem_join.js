const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");

const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/join.sol:GemJoin"];
var abi = JSON.parse(contractJson.abi);
const contractAddr = process.env.GEMJOIN;

var args = process.argv.slice(2);
if (args.length != 2) {
  console.log("Usage: node scripts/demo/gem_join.js <addr-to-join> <amount>");
  process.exit(1);
}
const addr = args[0];
const amount = parseInt(args[1], 10);

let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900, from: '0x0B585F8DaEfBC68a311FbD4cB20d9174aD174016' };

contract.methods
  .join(addr, amount)
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    console.log(response);
    process.exit(0);
  });

// contract.methods.wards('0xc162199cDaeAa5a82f00651dd4536F5d2d4277C5').call(options2).then(response => {
//   console.log(response);
//   process.exit(0);
// });
