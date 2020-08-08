const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
var args = process.argv.slice(2);
if (args.length != 2) {
  console.log("Usage: node scripts/balance.js <network(localnet|testnet|mainnet)> <addr>");
  process.exit(1);
}
var config = require('../../config.json')[`${args[0]}`];
const hmy = new Harmony(
    config.url,
    {
      chainType: ChainType.Harmony,
      chainId: config.chainid,
    }
  );
const addr = args[1];

var allJson = require("../../out/dapp.sol.json");
var contractJson = allJson.contracts["src/dai.sol:Dai"];
var abi = JSON.parse(contractJson.abi);
var contract = hmy.contracts.createContract(abi, process.env.DAI);

contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);
let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

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
        console.log("One balance: " + balance.toString());
        process.exit(0);
      });
  });
