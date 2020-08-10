const { Harmony } = require("@harmony-js/core");
const { ChainID, ChainType } = require("@harmony-js/utils");
const { toUtf8Bytes } = require("@harmony-js/contract");
const { hexlify } = require("@harmony-js/crypto");
var args = process.argv.slice(2);
if (args.length != 1) {
  console.log(
    "Usage: node scripts/deploy.js <network(localnet|testnet|mainnet)>"
  );
  process.exit(1);
}
var config = require("../config.json")[`${args[0]}`];
const hmy = new Harmony(config.url, {
  chainType: ChainType.Harmony,
  chainId: config.chainid,
});
let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

(async function () {
  var contractJson = require("../out/dapp.sol.json").contracts["src/vat.sol:Vat"];
  let options3 = { data: "0x" + contractJson.bin };
  var contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

  let response = await contract.methods.contractConstructor(options3).send(options2);
  const vat = response.transaction.receipt.contractAddress;
  console.log("export VAT=" + vat);

  contractJson = require("../out/dapp.sol.json").contracts["src/cat.sol:Cat"];
  options3 = { data: "0x" + contractJson.bin, arguments: [vat] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const cat = response.transaction.receipt.contractAddress;
  console.log("export CAT=" + cat);

  contractJson = require("../out/dapp.sol.json").contracts["src/spot.sol:Spotter"];
  options3 = { data: "0x" + contractJson.bin, arguments: [vat] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const spotter = response.transaction.receipt.contractAddress;
  console.log("export SPOTTER=" + spotter);

  contractJson = require("../out/dapp.sol.json").contracts["src/flip.sol:Flipper"];
  var ilk = hexlify(toUtf8Bytes("HarmonyERC20"));
  options3 = { data: "0x" + contractJson.bin, arguments: [vat, ilk] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const flipper = response.transaction.receipt.contractAddress;
  console.log("export FLIPPER=" + flipper);
      
  contractJson = require("../out/dapp.sol.json").contracts["lib/ds-token/src/token.sol:DSToken"];
  options3 = { data: "0x" + contractJson.bin, arguments: [ilk] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const gem = response.transaction.receipt.contractAddress;
  console.log("export GEM=" + gem);

  contractJson = require("../out/dapp.sol.json").contracts["src/join.sol:GemJoin"];
  options3 = { data: "0x" + contractJson.bin, arguments: [vat, ilk, gem] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const gemjoin = response.transaction.receipt.contractAddress;
  console.log("export GEMJOIN=" + gemjoin);

  const chainId = 2;
  contractJson = require("../out/dapp.sol.json").contracts["src/dai.sol:Dai"];
  options3 = { data: "0x" + contractJson.bin, arguments: [chainId] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const dai = response.transaction.receipt.contractAddress;
  console.log("export DAI=" + dai);

  contractJson = require("../out/dapp.sol.json").contracts["src/join.sol:DaiJoin"];
  options3 = { data: "0x" + contractJson.bin, arguments: [vat, dai] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const daijoin = response.transaction.receipt.contractAddress;
  console.log("export DAIJOIN=" + daijoin);

  ilk = hexlify(toUtf8Bytes("MKR"));
  contractJson = require("../out/dapp.sol.json").contracts["lib/ds-token/src/token.sol:DSToken"];
  options3 = { data: "0x" + contractJson.bin, arguments: [ilk] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const mkr = response.transaction.receipt.contractAddress;
  console.log("export MKR=" + mkr);

  contractJson = require("../out/dapp.sol.json").contracts["src/flop.sol:Flopper"];
  options3 = { data: "0x" + contractJson.bin, arguments: [vat, mkr] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const flopper = response.transaction.receipt.contractAddress;
  console.log("export FLOPPER=" + flopper);

  contractJson = require("../out/dapp.sol.json").contracts["src/flap.sol:Flapper"];
  options3 = { data: "0x" + contractJson.bin, arguments: [vat, mkr] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const flapper = response.transaction.receipt.contractAddress;
  console.log("export FLAPPER=" + flapper);

  contractJson = require("../out/dapp.sol.json").contracts["src/vow.sol:Vow"];
  options3 = { data: "0x" + contractJson.bin, arguments: [vat, flopper, flapper] };
  contract = hmy.contracts.createContract(JSON.parse(contractJson.abi));
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const vow = response.transaction.receipt.contractAddress;
  console.log("export VOW=" + vow);

  contractJson = require("../out/SimplePayment.json");
  options3 = { data: contractJson.bytecode, arguments: [gem] };
  contract = hmy.contracts.createContract(contractJson.abi);
  
  response = await contract.methods.contractConstructor(options3).send(options2);
  const payment = response.transaction.receipt.contractAddress;
  console.log("export PAYMENT=" + payment);

})();
