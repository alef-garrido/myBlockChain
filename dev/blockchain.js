const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];

// in Js there are no 'Clasess' as they are in many other lenguages, instead clasess are sugar-coding on top of constructor functions and the object prototype
//But we could try something like this:
// class Blockchain {
//     constructor() {
//         this.chain = [];
//         this.pendingTransactions = [];
//     }
//     //.. all other methods
// }

//Creatiing Data/structure

// Create Blockchain constructor function

function Blockchain() {
	this.chain = [] // this will store every block we create as a chain
	this.pendingTransactions = [] // this will hold new trnasaction before they're place into a block and mined
   
	this.currentNodeUrl = currentNodeUrl;
   	this.networkNodes = [];

   	this.createNewBlock(100, '0', '0');    
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = { // This will be a block iside of our chain. All data that we nweed is going to be store here.
        index: this.chain.length + 1, //this will be the blockNumber in our chain
        timestamp: Date.now(), // when this block was created
        transactions: this.pendingTransactions, //Inside of this block all the new transactions that had been jus created so they can never be changed/ On this block should be all pending/new transactions that are wainting to be placed into a new block
        nonce: nonce, //number from a proof of work proving that we have created this new block in a legitimate way
        hash: hash, // this will be tha data from our new block containing a string with all transactions made
        previousBlockHash: previousBlockHash // hash of previous block
    } 
    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

//Adding method to prototype to allow retreival of last created Block
Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

// Create a new transaction
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recepient: recipient
    }

    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index'] + 1;
}


//Add hashing method using SHA256 npm library
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

//Add Proof of work method

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0,4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
}



// exports code to be tested
module.exports = Blockchain; 
