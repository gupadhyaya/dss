const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
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

let daiContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["src/dai.sol:Dai"].abi),
  process.env.DAI
);
daiContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);

// // user will collateralize gems using gem join contract
let gemJoinContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["src/join.sol:GemJoin"].abi),
  process.env.GEMJOIN
);

// dai contract run by admin to mint dai
let daiJoinContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["src/join.sol:DaiJoin"].abi),
  process.env.DAIJOIN
);

let vatContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["src/vat.sol:Vat"].abi),
  process.env.VAT
);

var ilk = hexlify(toUtf8Bytes("HarmonyERC20"));

(async function() {
  await daiContract.methods.approve(process.env.DAIJOIN, daiAmount).send(options2);
  await daiJoinContract.methods.join(addr, daiAmount).send(options2);
  await vatContract.methods.frob(ilk, addr, addr, addr, -gemAmount, -daiAmount).send(options2);
  await gemJoinContract.methods.exit(addr, gemAmount).send(options2); 
  process.exit(0);
})();

// let gemContract = hmy.contracts.createContract(
//   JSON.parse(allJson.contracts["lib/ds-token/src/token.sol:DSToken"].abi),
//   process.env.GEM
// );
// gemContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);
// gemContract.methods.balanceOf(process.env.GEMJOIN).call(options2).then(balance => {
//   console.log(balance.toString());
// });