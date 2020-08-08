const { Harmony } = require("@harmony-js/core");
const { numberToHex, ChainType, hexToNumber } = require("@harmony-js/utils");
var args = process.argv.slice(2);
if (args.length != 2) {
  console.log("Usage: node scripts/return_gem.js <network(localnet|testnet|mainnet)> <amount>");
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
const ONE = "000000000000000000";
const amount = parseInt(args[1], 10);
const amountHex = numberToHex(amount.toString() + ONE);

const contractJson = require("../../out/SimplePayment.json");
var abi = contractJson.abi;
const contractAddr = process.env.PAYMENT;

let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

contract.methods
  .withdraw(hexToNumber(amountHex))
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    console.log(response);
    process.exit(0);
  });
