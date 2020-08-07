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
const contractJson = allJson.contracts["lib/ds-token/src/token.sol:DSToken"];
var abi = JSON.parse(contractJson.abi);
const contractAddr = "0xb4f43907dbd299782d0f965a045432c17ca8571e";

(function () {
  const hmy_ws = new Harmony("wss://ws.s0.b.hmny.io", {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  });
  const contract = hmy_ws.contracts.createContract(abi, contractAddr);
  contract.events
    .Mint()
    .on("data", (event) => {
      console.log(event);
    })
    .on("error", console.error);
})();

var args = process.argv.slice(2);
if (args.length != 2) {
  console.log("Usage: node scripts/join/fund_gem.js <addr-to-fund> <amount>");
  process.exit(1);
}
const addr = args[0];
const amount = parseInt(args[1], 10);

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
    process.exit(0);
  });
