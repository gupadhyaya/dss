const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
var args = process.argv.slice(2);
if (args.length != 2) {
  console.log("Usage: node scripts/approve_gem.js <network(localnet|testnet|mainnet)> <addr>");
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

const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["lib/ds-token/src/token.sol:DSToken"];
var abi = JSON.parse(contractJson.abi);
const contractAddr = process.env.GEM;

let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

contract.methods["approve(address)"](addr)
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    console.log(response.transaction.receipt);
    process.exit(0);
  });
