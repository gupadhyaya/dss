const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 3) {
  console.log("Usage: node scripts/payback_dai.js <network(localnet|testnet|mainnet)> <addr> <dai>");
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
const daiAmount = parseInt(args[2], 10);
let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

const allJson = require("../../out/dapp.sol.json");

let daiContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["src/dai.sol:Dai"].abi),
  process.env.DAI
);
daiContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);

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
  let res = await daiContract.methods.approve(process.env.DAIJOIN, daiAmount).send(options2);
  console.log(res);
  res = await daiJoinContract.methods.join(addr, daiAmount).send(options2);
  console.log(res);
  res = await vatContract.methods.frob(ilk, addr, addr, addr, 0, -daiAmount).send(options2);
  console.log(res);
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