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
      return false;
    }

    // Vérifier si le bloc contient des transactions (Genesis block n'en a pas)
    const transactionsString = block.transaction && block.transaction.length > 0
      ? JSON.stringify(block.transaction)
      : "GENESIS_BLOCK";

    return generateHashFromString(block.index + block.timestamp + transactionsString + block.proof + block.previousHash);
  }


  function generateProof(transaction) {
    if (!transaction || transaction.sender === undefined || transaction.receiver === undefined || transaction.amount === undefined) {
      return false;
    }
    if (transaction.sender === 0) {
      return generateIntegerFromAddress(transaction.receiver) * parseFloat(transaction.amount);
    }
    return Math.abs(generateIntegerFromAddress(transaction.sender) - generateIntegerFromAddress(transaction.receiver)) * parseFloat(transaction.amount);
  }

  function isValidProof(currentProof, previousProof) {
    /*
    * Vérifie que la preuve de travail est valide en respectant une règle de difficulté.
    * Exemple simple : concaténer les preuves et vérifier que le hash commence par "0000".
    */
    const crypto = require("crypto");
    const guess = `${currentProof}${previousProof}`;
    const guessHash = crypto.createHash("sha256").update(guess).digest("hex");       

    return guessHash.startsWith("0000"); // Exige que le hash commence par "0000"
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
