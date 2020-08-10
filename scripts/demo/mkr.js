const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");

const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  "https://api.s0.b.hmny.io",
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  }
);

const allJson = require("../../out/dapp.sol.json");
let contract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts["lib/ds-token/src/token.sol:DSToken"].abi),
  process.env.MKR
);
contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

contract.methods
  .symbol()
  .call(options2)
  .then((response) => {
    console.log(response);
    process.exit(0);
  });
