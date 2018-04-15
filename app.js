
/**
 * Module dependencies.
 */
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const Blockchain = require("./blockchain_modules/blockchain");
const Transaction = require("./blockchain_modules/transaction");

__DEBUG_MODE__ = true;

var db;
var myCrypto = new Blockchain();

// Change the id/password/url to the mongodb. 
MongoClient.connect('mongodb://admin:admin@ds157342.mlab.com:57342/expressweb_kaopaigu', (err, database) => {
  if (err) return console.log(err);
  db = database.db('expressweb_kaopaigu');
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})
 

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Display all the pending trransactions
app.get('/', function (req, res) {
  db.collection('pending_transaction').find({}, { _id: 0 }).toArray(function (err, results) {
    if (err) return console.log(err);
    res.render('index.ejs', { pending_transaction: results });
  })

})
 
app.post('/create_transaction', function (req, res) {
  trans = new Transaction(req.body.fromAcct, req.body.toAcct, req.body.amount);
  db.collection('pending_transaction').save(trans, function (err, result) {
    if (err) return console.log(err);
    console.log('saved pending_transaction to DB');
    res.redirect('/');
  })
})

app.post('/mine', function (req, res) {
  let transactions = [];
  db.collection('pending_transaction').find({}, { _id: 0 }).toArray(function (err, results) {
    if (err) return console.log(err);

    results.forEach(function (item, index, array) {
      trans = new Transaction(item.sourceAcct, item.targetAcct, item.amount);
      transactions.push(trans);
     });

    myCrypto.setPendingTransactions(transactions);
    myCrypto.minePendingTransactions('acct_0000000_jayson');

    myCrypto.pendingTransactions.forEach(function (item, index, array) {
      let myquery = { sourceAcct: item.sourceAcct, targetAcct: item.targetAcct, amount: item.amount };
      db.collection("pending_transaction").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " document(s) deleted");
      });
    });

    myCrypto.pendingTransactions.forEach(function (item, index, array) {
      db.collection('pending_transaction').save(item, function (err, result) {
        if (err) return console.log(err);
        console.log('saved pending_transaction to DB ');
      });
    });

    db.collection('blocks').save(myCrypto.getLatestBlock(), function (err, result) {
      if (err) return console.log(err);
      console.log('saved new block to DB');
    });

    res.redirect('/');
  })
})


module.exports = app;