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
const contractJson = allJson.contracts["src/dai.sol:Dai"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, process.env.DAI);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);
let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

var args = process.argv.slice(2);
if (args.length != 2) {
  console.log("Usage: node scripts/join/fund_gem.js <addr-to-fund> <amount>");
  process.exit(1);
}
const addr = args[0];
const amount = parseInt(args[1], 10);

contract.methods["burn(address,uint256)"](addr, amount)
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
