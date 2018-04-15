/**
 * Class Transaction
 */
module.exports =  class Transaction
{
    constructor(sourceAcct, targetAcct, amount){
        this.sourceAcct = sourceAcct;
        this.targetAcct = targetAcct;
        this.amount = amount;
    }

}


