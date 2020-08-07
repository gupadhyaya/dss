const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType, hexToNumber } = require("@harmony-js/utils");

const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io", //"http://localhost:9500",//
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const contractJson = require("../../out/SimplePayment.json");
var abi = contractJson.abi;
const contractAddr = process.env.PAYMENT;

let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);

const amount = "0x6D499EC6C63380000"; // equivalent to 126 ONEs
let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

contract.methods
  .withdraw(hexToNumber(amount))
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    console.log(response);
    process.exit(0);
  });
