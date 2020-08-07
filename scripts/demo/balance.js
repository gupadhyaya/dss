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

var allJson = require("../../out/dapp.sol.json");
var contractJson = allJson.contracts["src/dai.sol:Dai"];
var abi = JSON.parse(contractJson.abi);
var contract = hmy.contracts.createContract(abi, process.env.DAI);

contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);
let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

var args = process.argv.slice(2);
if (args.length != 1) {
  console.log("Usage: node scripts/demo/balance.js <addr>");
  process.exit(1);
}
const addr = args[0];

contract.methods
  .balanceOf(addr)
  .call(options2)
  .then((balance) => {
    console.log("Dai balance: " + balance.toString());
    contractJson = allJson.contracts["lib/ds-token/src/token.sol:DSToken"];
    abi = JSON.parse(contractJson.abi);
    contract = hmy.contracts.createContract(abi, process.env.GEM);
    contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);
    contract.methods
      .balanceOf(addr)
      .call(options2)
      .then((balance) => {
        console.log("Gem balance: " + balance.toString());
        process.exit(0);
      });
  });
