# NetSecJcomp
E-voting application based on ethereum blockchain

Requirements: 
Node and Ganache

Running the program: 
1)Start Ganache
2)cd into the project folder and run the following coomands:
  node
  Web3 = require('web3')
  web3 = new Web3("http://localhost:7545")
  web3.eth.getAccounts(console.log)

  bytecode = fs.readFileSync('Voting_sol_Voting.bin').toString()
  abi = JSON.parse(fs.readFileSync('Voting_sol_Voting.abi').toString())

  deployedContract = new web3.eth.Contract(abi)

  listOfCandidates = ['BJP', 'Congress', 'NOTA']

  deployedContract.deploy({ data: bytecode, arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name))] }).send({ from: '0x41d07EF62Cf018835baB662530C0EC7D18DDe20b', gas: 1500000, gasPrice: web3.utils.toWei('0.00003', 'ether') }).then((newContractInstance) => { deployedContract.options.address = newContractInstance.options.address; console.log(newContractInstance.options.address) });

  //Insert the address of node in from:"Address"
  //Insert this contract address in js/index.js




