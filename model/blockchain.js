// model/blockchain.js
const { json } = require('body-parser');
var addressUtilities = require('../utils/address');
var arrayUtilities = require('../utils/array');
var validator = require('../utils/validator');

var blockchain = function blockchain(){

  var self = this;

  this.init = init;
  this.newBlock = newBlock;
  this.newTransaction = newTransaction;
  this.getChain = getChain;
  this.checkChain = checkChain;
  this.mine = mine;
  this.difficultie = 4;

  this.chain;
  this.currentTransactions;

  function init(){
    /*
    *  initialize the blockchain, creating a new empty chain,
    *  an empty transactions list and creating the first block
    */
    self.chain = [];
    self.currentTransactions = [];
    const timestamp = new Date().getTime()
    self.newBlock(timestamp, 100,"GENESIS_HASH");
  }

  function getChain(){
    /*
    *  returns the chain
    */
    return self.chain;
  }

  function mine(miner){
    /*
    *  implements the mining function. simple as is, it just
    *  creates a new transaction with "sender" 0 to show that
    *  this is a mined block.
    */
    const timestamp = new Date().getTime()
    var lastBlock = self.chain[self.chain.length-1];
    var transaction = newTransaction(0,miner,1);
    var previousHash = validator.calculateHash(lastBlock);
    var proof = validator.generateProof(self.chain.length+1, self.currentTransactions, previousHash, timestamp, this.difficultie);

    console.log(previousHash);
    
    
    return newBlock(timestamp, proof, previousHash);
  }

  function newBlock(timestamp, proof, previousHash){
    /*
    *  Generate a new blocks and adds it to the chain
    */
    var block = {
      "index": self.chain.length+1,
      "timestamp": timestamp,
      "transaction": self.currentTransactions,
      "proof": proof,
      "previousHash": previousHash
    }
    self.currentTransactions = [];
    self.chain.push(block);
    return block;
  }

  function newTransaction(sender, receiver, amount){
    /*
    *  Generate a new transaction
    */
    var transaction = {
      sender: sender,
      receiver: receiver,
      amount: amount
    };
    self.currentTransactions.push(transaction);
    return transaction;
  }

  function checkChain() {
    
    if (self.chain.length < 2) {
        return true; // Si la blockchain ne contient que le bloc genesis, elle est valide.
    }

    for (let i = 1; i < self.chain.length; i++) {
        const currentBlock = self.chain[i];
        const previousBlock = self.chain[i - 1];

        // Vérifier que le hash du bloc précédent correspond bien au previousHash du bloc actuel
        const recalculatedPreviousHash = validator.calculateHash(previousBlock);
        if (currentBlock.previousHash !== recalculatedPreviousHash) {
            console.error(`Erreur: Le hash du bloc ${i - 1} ne correspond pas au previousHash du bloc ${i}`);
            
            return false;
        }

        // Vérifier la validité de la preuve de travail
        if (!validator.isValidProof(currentBlock.index, currentBlock.transaction, currentBlock.previousHash, currentBlock.timestamp, currentBlock.proof.proof, this.difficultie)) {
            console.error({
              "result": false,
              "message": `Erreur: La preuve de travail du bloc ${currentBlock.index} est invalide.`,
              currentBlock
            });
            return {
              "result": false,
              "message": `Erreur: La preuve de travail du bloc ${currentBlock.index} est invalide.`,
              currentBlock
            };
        }
    }

    console.log("La blockchain est valide.");
    return {
      "result": true,
      "message": "La blockchain est valide.",
      "chaine": self.chain
    };
}



  if(blockchain.caller != blockchain.getInstance){
    throw new Error("This object cannot be instanciated");
  }

};


blockchain.instance = null;
blockchain.getInstance = function(){
	if(this.instance === null){
		this.instance = new blockchain();
	}
	return this.instance;
};

module.exports = blockchain.getInstance();
