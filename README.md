# E-Voting Wesite
E-voting application based on ethereum blockchain

Requirements: 
Node and Ganache

Running the program: 

1)Start Ganache at the port: 7545 in your local system.

2)cd into the project folder and run the following commands:

  npm install web3

  node
  
  npm install web3
  
  Web3 = require('web3')
  
  web3 = new Web3("http://localhost:7545")
  
  web3.eth.getAccounts(console.log)

  bytecode = fs.readFileSync('Voting_sol_Voting.bin').toString()
  
  abi = JSON.parse(fs.readFileSync('Voting_sol_Voting.abi').toString())

  deployedContract = new web3.eth.Contract(abi)

  listOfCandidates = ['BJP', 'Congress', 'NOTA']. //Change them as per your choice

  deployedContract.deploy({ data: bytecode, arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name))] }).send({ from: '//ADD AN ADDRESS FROM GANACHE', gas: 1500000, gasPrice: web3.utils.toWei('0.00003', 'ether') }).then((newContractInstance) => { deployedContract.options.address = newContractInstance.options.address; console.log(newContractInstance.options.address) });

  //Insert the address of node in from:"Address"
  //Insert this contract address in js/index.js

open another terminal window and cd to the client folder inside the project folder, then run the following commands:

  npm install

  yarn start
  
In another terminal window, cd into the server inside the repo  and run the following commands: 

  npm install
  
  npx nodemon index.js
  
Now Go to http://localhost:3000/ to access the website





