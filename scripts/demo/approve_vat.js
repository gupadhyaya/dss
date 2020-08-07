const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
const hmy = new Harmony("https://api.s0.b.hmny.io", {//http://localhost:9500
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
});

const contractAddr = "0x01b93dbdca395b0583b8ca444b8c63d2f4f5963f";
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/vat.sol:Vat"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);//0xc5f56b27569c046cbce0d3a017b9939e68d9b11c
//one1c93pn8x6a2j6stcqv5wag5m0t5k5ya79ge86sg
//0xc162199cDaeAa5a82f00651dd4536F5d2d4277C5
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

// var args = process.argv.slice(2);
// if (args.length != 1) {
//   console.log("Usage: node scripts/demo/approve_vat.js <addr-to-approve>");
//   process.exit(1);
// }
// const addr = args[0];
// const addr = '0x0B585F8DaEfBC68a311FbD4cB20d9174aD174016';
// const gems = 160;
// const dais = 1;
var ilk = hexlify(toUtf8Bytes("HarmonyERC20"));
// const value = hexToBN('0xC9F2C9CD04674EDEA40000000');
// const spot = hexToBN('0x771D2FA45345AA9000000');
// console.log(contract.methods);
// (async function() {
//   // let res = await contract.methods.init(ilk).send(options2);
//   let res = await contract.methods['file(bytes32,uint256)'](hexlify(toUtf8Bytes("Line")), value).send(options2);
//   console.log(res);
//   res = await contract.methods['file(bytes32,bytes32,uint256)'](ilk, hexlify(toUtf8Bytes("line")), value).send(options2);
//   console.log(res);
//   res = await contract.methods['file(bytes32,bytes32,uint256)'](ilk, hexlify(toUtf8Bytes("spot")), spot).send(options2);
//   console.log(res);
//   // res = await contract.methods.frob(ilk, addr, addr, addr, gems, dais).send(options2);
//    res = await contract.methods.ilks(ilk).call(options2);
//   console.log(res);
// })();
(async function() {
  let res = await contract.methods.urns(ilk, process.env.USER).call(options2);//process.env.GEMJOIN
  // let res = await contract.methods.gem(ilk, process.env.GEMJOIN).call(options2);
  console.log(res);
  // res = await contract.methods.ilks(ilk).call(options2);

  // res = await contract.methods.dai(process.env.DAIJOIN).call(options2);
  // console.log(res);
})();


// contract.methods
//   .frob(ilk, addr, addr, addr, gems, dais)
//   .send(options2)
//   .then((response) => {
//     console.log(response);
//     process.exit(0);
//   });
// contract.methods.wards('0x617924ed75703447812bc757e76d07d7ab0c1f5f').call(options2).then(response => {
//     console.log(response);
//     process.exit(0);
// });
