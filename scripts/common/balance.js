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

var args = process.argv.slice(2);
if (args.length != 1) {
  console.log("Usage: node scripts/common/balance.js <addr>");
  process.exit(1);
}
const addr = args[0];

let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

contract.methods
  .balanceOf(addr)
  .call(options2)
  .then((response) => {
    console.log(response.toString());
    process.exit(0);
  });

// contract.methods["approve(address,uint256)"](
//   "0x617924ed75703447812bc757e76d07d7ab0c1f5f",
//   160
// )
//   .send(options2)
//   .then((response) => {
//     if (response.transaction.txStatus == "REJECTED") {
//       console.log("Reject");
//       process.exit(0);
//     }
//     console.log(response.transaction.receipt);
//     process.exit(0);
//   });
