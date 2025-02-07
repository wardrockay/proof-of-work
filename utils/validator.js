// utils/validator.js
const { log } = require("console");
const crypto = require("crypto");

var ValidatorHandler = function ValidatorHandler() {

  var self = this;

  this.calculateHash = calculateHash;
  this.generateProof = generateProof;
  this.isValidProof = isValidProof

  function calculateHash(block) {
    if (!block || typeof block !== "object" || !block.index || !block.timestamp || !block.proof || !block.previousHash) {
      console.log({
        block,
        
      })
      return false;
    }

    // Vérifier si le bloc contient des transactions (Genesis block n'en a pas)
    const transactionsString = block.transaction && block.transaction.length > 0
      ? JSON.stringify(block.transaction)
      : "GENESIS_BLOCK";

    return generateHashFromString(block.index + block.timestamp + transactionsString + block.proof + block.previousHash);
  }


  function generateProof(index, transactions, previousHash, timestamp, difficulty) {
    let nonce = 0;
    let hash = "";
    let prefix = "0".repeat(difficulty);

    do {
      nonce++;
      let data = index + previousHash + JSON.stringify(transactions) + timestamp + nonce;
      hash = crypto.createHash('sha256').update(data).digest('hex');
    } while (!hash.startsWith(prefix));

    console.log('---generateProof---');
    console.log({ index, proof: nonce, hash });   

    return { proof: nonce, hash };
  }


  function isValidProof(index, transactions, previousHash, timestamp, nonce, difficulty) {
    const prefix = "0".repeat(difficulty);
    const blockData = index + previousHash + JSON.stringify(transactions) + timestamp + nonce;
    const guessHash = crypto.createHash("sha256").update(blockData).digest("hex");

    console.log('---isValidProof---');
    console.log({
      'prefix': prefix,
      'block data': blockData,
      'isValid': guessHash.startsWith(prefix)
    });
    
    return guessHash.startsWith(prefix); // Vérifie si le hash respecte la difficulté
  }


  function generateHashFromString(string) {
    return crypto.createHash("sha256").update(string).digest("hex");
  }

  function generateIntegerFromAddress(address) {
    return parseInt(address.match(/[0-9]+/g).join(""));
  }

  if (ValidatorHandler.caller != ValidatorHandler.getInstance) {
    throw new Error("This object cannot be instanciated");
  }

};


ValidatorHandler.instance = null;
ValidatorHandler.getInstance = function () {
  if (this.instance === null) {
    this.instance = new ValidatorHandler();
  }
  return this.instance;
};

module.exports = ValidatorHandler.getInstance();
