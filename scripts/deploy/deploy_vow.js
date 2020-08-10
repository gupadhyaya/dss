const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 1) {
  console.log("Usage: node scripts/deploy.js <network(localnet|testnet|mainnet)>");
  process.exit(1);
}
var config = require('../config.json')[`${args[0]}`];
const hmy = new Harmony(
    config.url,
    {
      chainType: ChainType.Harmony,
      chainId: config.chainid,
    }
  );

const allJson = require("../out/dapp.sol.json");
const contractJson = allJson.contracts['src/vow.sol:Vow'];
var abi = JSON.parse(contractJson.abi);
var bin = '0x' + contractJson.bin;

let contract = hmy.contracts.createContract(abi);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };
const vatAddr = '0x5df6b8de8e82e49a40e29d30f2e05f1adafbaf77';
const flapperAddr = '0xd51d34a277f4cd10514402df1e0eb5044ba0a8e4';
const flopperAddr = '0x696f599f6780c2b62df511d4c97e3e2900a77ebf';
let options3 = { data: bin, arguments: [vatAddr, flapperAddr, flopperAddr] };

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
