const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
const hmy = new Harmony("https://api.s0.b.hmny.io", {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const contractAddr = "0x01b93dbdca395b0583b8ca444b8c63d2f4f5963f";
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/vat.sol:Vat"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
//one1c93pn8x6a2j6stcqv5wag5m0t5k5ya79ge86sg
//0xc162199cDaeAa5a82f00651dd4536F5d2d4277C5
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

var args = process.argv.slice(2);
if (args.length != 1) {
  console.log("Usage: node scripts/demo/approve_vat.js <addr-to-approve>");
  process.exit(1);
}
const addr = args[0];

contract.methods
  .rely(addr)
  .send(options2)
  .then((response) => {
    console.log(response);
    process.exit(0);
  });
// contract.methods.wards('0x617924ed75703447812bc757e76d07d7ab0c1f5f').call(options2).then(response => {
//     console.log(response);
//     process.exit(0);
// });
