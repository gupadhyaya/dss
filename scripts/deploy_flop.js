const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const allJson = require("../out/dapp.sol.json");
const contractJson = allJson.contracts['src/flop.sol:Flopper'];
var abi = JSON.parse(contractJson.abi);
var bin = '0x' + contractJson.bin;

let contract = hmy.contracts.createContract(abi);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };
const vatAddr = '0x01b93dbdca395b0583b8ca444b8c63d2f4f5963f';
const gemAddr = '0xb4f43907dbd299782d0f965a045432c17ca8571e';
let options3 = { data: bin, arguments: [vatAddr, gemAddr] };

contract.methods
  .contractConstructor(options3)
  .send(options2)
  .then((response) => {
    if (response.transaction.txStatus == "REJECTED") {
      console.log("Reject");
      process.exit(0);
    }
    console.log(
      "contract deployed at " + response.transaction.receipt.contractAddress
    );
    process.exit(0);
  });
