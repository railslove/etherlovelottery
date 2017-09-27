#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const solc = require('solc');
const Web3 = require('web3');

let providerURL = 'http://localhost:8545';
let web3 = new Web3(new Web3.providers.HttpProvider(providerURL));
let networkId = web3.version.network;
let deployAccount = web3.eth.accounts[0];

let contractSources = {'Railslove': fs.readFileSync('Railslove.sol').toString('utf8')};
console.log('compiling contracts. please wait...');
let compiledContracts = solc.compile({sources: contractSources}, 1);

if (compiledContracts.errors) {
  console.log('compilation failed with the following errors:');
  compiledContracts.errors.forEach(error => console.log(error));
  process.exit(1);
}

let contractData = compiledContracts.contracts['Railslove:Railslove'];
let abi = JSON.parse(contractData.interface);
let contract = web3.eth.contract(abi);

console.log('deploying. You might need to enter the account password in the parity UI: http://localhost:8180');

contract.new({from: deployAccount, data: '0x' + contractData.bytecode}, function(err, deployedContract) {
  if(err) {
    console.log('failed to deploy');
    console.log(err);
  } else {
    if (!deployedContract.address) {
      console.log(`transaction hash: ${deployedContract.transactionHash}`);
    } else { // check address on the second call (contract deployed)
      console.log(`address: ${deployedContract.address}`);
      let fileContent = {
        address: deployedContract.address,
        abi: abi
      };
      fs.writeFileSync('contract-metadata.js', JSON.stringify(fileContent));
    }
  }
});
