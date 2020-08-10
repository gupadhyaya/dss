const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
var args = process.argv.slice(2);
if (args.length != 3) {
  console.log("Usage: node scripts/fund_gem.js <network-url> <addr-to-fund> <amount>");
  process.exit(1);
}
const url = args[0];
const addr = args[1];
const amount = parseInt(args[2], 10);
const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  url,//'http://localhost:9500',//"https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const allJson = require("../../out/dapp.sol.json");
let contract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["lib/ds-token/src/token.sol:DSToken"].abi),
  process.env.MKR
);
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
