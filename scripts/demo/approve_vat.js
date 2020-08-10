const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
// var args = process.argv.slice(2);
// if (args.length != 2) {
//   console.log("Usage: node scripts/deploy_vat.js <network-url> <addr-to-approve>");
//   process.exit(1);
// }
// const url = args[0];
const addr = args[1];
const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.t.hmny.io",//'http://localhost:9500',//"https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyMainnet,
  }
);
const contractAddr = process.env.VAT;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/vat.sol:Vat"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);//0xc5f56b27569c046cbce0d3a017b9939e68d9b11c
//one1c93pn8x6a2j6stcqv5wag5m0t5k5ya79ge86sg
//0xc162199cDaeAa5a82f00651dd4536F5d2d4277C5
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

// (async function() {
//   let res = await contract.methods.rely(addr).send(options2);
//   console.log(res);
// })();

(async function() {
  let res = await contract.methods.rely(addr).send(options2);
  console.log(res);
})();
