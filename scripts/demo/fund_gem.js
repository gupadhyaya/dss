const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
var args = process.argv.slice(2);
if (args.length != 3) {
  console.log("Usage: node scripts/fund_gem.js <network(localnet|testnet|mainnet)> <addr> <amount>");
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
const amount = parseInt(args[2], 10);

const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["lib/ds-token/src/token.sol:DSToken"];
var abi = JSON.parse(contractJson.abi);
const contractAddr = process.env.GEM;

let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

contract.methods["mint(address,uint256)"](addr, amount)
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    console.log(response.transaction.receipt);
    contract.methods.balanceOf(addr).call(options2).then(balance => {
      console.log('balance: ' + balance.toString());
      process.exit(0);
    });
  });
