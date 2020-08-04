var src = process.argv.slice(2)[0];

const allJson = require("../out/dapp.sol.json");
const contractJson = allJson.contracts[src];
var abi = JSON.parse(contractJson.abi);

console.log(contractJson.abi);