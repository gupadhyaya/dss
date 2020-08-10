const fetch = require("node-fetch");
const { Harmony } = require("@harmony-js/core");
const { numberToHex, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 2) {
  console.log(
    "Usage: node scripts/demo/keeper_flap.js <network(localnet|testnet|mainnet)> <keepr-private>"
  );
  process.exit(1);
}
var config = require("../../config.json")[`${args[0]}`];
const hmy = new Harmony(config.url, {
  chainType: ChainType.Harmony,
  chainId: config.chainid,
});
let prv = args[1];

const contractAddr = process.env.VOW;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/vow.sol:Vow"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(prv);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

(function () {
  const hmy_ws = new Harmony(config.ws, {
    chainType: ChainType.Harmony,
    chainId: config.chainid,
  });

  hmy_ws.contracts
    .createContract(
      JSON.parse(allJson.contracts["src/flap.sol:Flapper"].abi),
      process.env.FLIPPER
    )
    .events.Kick()
    .on("data", (event) => {
      console.log(event);
    })
    .on("error", console.error);
})();

// bite under lump
(async function () {
  let res = await contract.methods.flap().send(options2);
  // console.log(res);
})();
