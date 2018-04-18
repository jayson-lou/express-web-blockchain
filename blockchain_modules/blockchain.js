/**
 * Class Blockchain
 */

const Transaction = require("./transaction");
const Block = require("./block");

module.exports = class Blockchain
{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        this.pendingTransactions = [];
        this.miningReward = 1;
    }

    // Create the genesis block.
    createGenesisBlock() {
        let transaction = new Transaction(null, 'acct_0000001', 1000);
        let transactions = [transaction];
        let timestampt = Date.parse("2018-04-01");
        return new Block(timestampt, transactions, "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    setMiningDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    setMiningReward(reward) {
        this.miningReward = reward;
    }

    setPendingTransactions(transactions) {
        this.pendingTransactions = transactions;
    }
 
    setChain(chain) {
        this.chain = chain;
    }
       
    minePendingTransactionsWithGivenHash(minerAcct, previousHash){
        __DEBUG_MODE__ && console.log('Miner ' + minerAcct + ' start to mine the pending transaction...');

        let block = new Block(Date.now(), this.pendingTransactions, previousHash);
        block.mineBlock(this.difficulty);

        __DEBUG_MODE__ && console.log('Miner ' + minerAcct + ' successfully mined the block.');
        // Add this block to the chain
        this.chain.push(block);

        this.pendingTransactions = [];
        // Awarding the miner
        __DEBUG_MODE__ && console.log('Miner ' + minerAcct + ' will get the reward ' + this.miningReward + '.');
        this.pendingTransactions = [ new Transaction('000_blockchain_system_000', minerAcct, this.miningReward) ];
    }


    
    minePendingTransactions(minerAcct){
        __DEBUG_MODE__ && console.log('Miner ' + minerAcct + ' start to mine the pending transaction...');

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        __DEBUG_MODE__ && console.log('Miner ' + minerAcct + ' successfully mined the block.');
        // Add this block to the chain
        this.chain.push(block);

        this.pendingTransactions = [];
        // Awarding the miner
        __DEBUG_MODE__ && console.log('Miner ' + minerAcct + ' will get the reward ' + this.miningReward + '.');
        this.pendingTransactions = [ new Transaction('000_blockchain_system_000', minerAcct, this.miningReward) ];
    }

    // Add a new transaction to the pending list
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    // Calculate the balance for an account
    getBalanceOfAccount(acctNo){ 
        let balance = 0;
        for(const block of this.chain){             
            for(const transaction of block.transactions){                
                if(transaction.sourceAcct === acctNo){
                    balance -= transaction.amount;
                }
                if(transaction.targetAcct === acctNo){
                    balance += transaction.amount;
                }
            }
        }
        __DEBUG_MODE__ && console.log('Account ' + acctNo + ' has the balance of ' + balance + '.');
        return balance;
    }

    //To check if the chain is valid
    // - check if 'previousHash' is correct
    // - check if current 'hash' is correct - by recalculating it
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash() || currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    // To check if a transaction is valid
    // - check if the sender has enough coins
    isTransactionValid(transaction) {
        if (this.getBalanceOfAccount(transaction.sourceAcct) >= transaction.amount) {
            return true;
        } else {
            return false;
        }
    }
}
