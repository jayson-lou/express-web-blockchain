/**
 * Class Block
 */
const SHA256 = require("crypto-js/sha256");

module.exports = class Block 
{
    constructor(timestamp, transactions, previousHash) {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; 
    }

    // Calculate the hash value based on all the information in the transaction
    calculateHash() {
        let transactionsJSONString = JSON.stringify(this.transactions);
        return SHA256(this.timestamp + transactionsJSONString + this.previousHash + this.nonce).toString();
    }
    
    // Keep calculating the hash of the transaction until it meets our requirement
    mineBlock(difficulty) {
        __DEBUG_MODE__ && console.log('Start to mine the block with the following transactions');
        __DEBUG_MODE__ && console.log(JSON.stringify(this.transactions));

        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        __DEBUG_MODE__ && console.log(" - Block is successfully mind with hash " + this.hash + '.');
    }
}

