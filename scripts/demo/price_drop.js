const fetch = require("node-fetch");
const { Harmony } = require("@harmony-js/core");
const { numberToHex, ChainType, hexToBN } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 1) {
  console.log("Usage: node scripts/vat.js <network(localnet|testnet|mainnet)>");
  process.exit(1);
}
var config = require("../../config.json")[`${args[0]}`];
const hmy = new Harmony(config.url, {
  chainType: ChainType.Harmony,
  chainId: config.chainid,
});

const contractAddr = process.env.VAT;
const allJson = require("../../out/dapp.sol.json");
const contractJson = allJson.contracts["src/vat.sol:Vat"];
var abi = JSON.parse(contractJson.abi);
let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);
const RATE = 10 ** 27;
let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

async function postData(url) {
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });
  return response.json();
}

(async function () {
  var ilk = hexlify(toUtf8Bytes("HarmonyERC20"));
  // let data = await postData("https://api.binance.com/api/v1/ticker/price?symbol=ONEUSDT");
  // console.log(data.price*10**18);
  // let data = 0.01 * RATE;

  const old_spot = hexToBN("0x84595161401484A000000"); // 0.01 price
  const new_spot = hexToBN("0x52B7D2DCC80CD2E400000"); // 0.00625 price
  const debt_spot = hexToBN("0x5295F13EBB7127C000000"); // 0.0624 price
  let res = await contract.methods["file(bytes32,bytes32,uint256)"](
    ilk,
    hexlify(toUtf8Bytes("spot")),
    debt_spot
  ).send(options2);
  console.log(res);
})();