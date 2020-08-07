const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const hmy = new Harmony("https://api.s0.b.hmny.io", {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

var args = process.argv.slice(2);
if (args.length != 3) {
  console.log(
    "Usage: node scripts/demo/borrow.js <addr> <collateral-amount> <dai-amount>"
  );
  process.exit(1);
}
const addr = args[0];
const gemAmount = parseInt(args[1], 10);
const daiAmount = parseInt(args[2], 10);
let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

const allJson = require("../../out/dapp.sol.json");

let gemContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["lib/ds-token/src/token.sol:DSToken"].abi),
  process.env.GEM
);
gemContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);

// user will collateralize gems using gem join contract
let gemJoinContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["src/join.sol:GemJoin"].abi),
  process.env.GEMJOIN
);
gemJoinContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);

// dai contract run by admin to mint dai
let daiContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["src/dai.sol:Dai"].abi),
  process.env.DAI
);
daiContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

// user need to approve gemjoin contract to withdraw gems
gemContract.methods["approve(address,uint256)"](process.env.GEMJOIN, gemAmount)
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    console.log(response.transaction.receipt);
    // collateralize gems by joining
    gemJoinContract.methods
      .join(addr, gemAmount)
      .send(options2)
      .then((response) => {
        if (response.transaction.txStatus == "REJECTED") {
          console.log("Reject");
          process.exit(0);
        }
        console.log(response);
        // finally fund dai that was requested
        daiContract.wallet.setSigner(process.env.ADMIN);
        daiContract.methods["mint(address,uint256)"](addr, daiAmount)
          .send(options2)
          .then((response) => {
            if (response.transaction.txStatus == "REJECTED") {
              console.log("Reject");
              process.exit(0);
            }
            console.log(response.transaction.receipt);
            process.exit(0);
          });
      });
  });
