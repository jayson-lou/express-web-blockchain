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
// var dbConnectionString = 'mongodb://admin:admin@ds157342.mlab.com:57342/expressweb_kaopaigu'; //TEST
var dbConnectionString  = 'mongodb://admin:admin@127.0.0.1:27017/expressweb_kaopaigu'; // DEV
MongoClient.connect(dbConnectionString, (err, database) => {
  if (err) return console.log(err);
  db = database.db('expressweb_kaopaigu');
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})


// All environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var callback = function (err, data) {
  if (err) return console.error(err);
  console.log(data);
};

// Display all the pending transactions
app.get('/', function (req, res) {
  db.collection('blocks').count({}, function (error, numOfDocs) {
    if (error) return callback(error);
    if (numOfDocs === 0) {
    db.collection('blocks').save(myCrypto.getLatestBlock(), function (err, result) {
        if (err) return console.log(err);
        console.log('Save Genesis Block to DB');
      });
    }
  });

  db.collection('pending_transaction').find({}, {_id: 0}).toArray(function (err, results) {
    if (err) return console.log(err);
    res.render('index.ejs', {
      pending_transaction: results
    });
  })
})

// Create and save transaction
app.post('/create_transaction', function (req, res) {
  trans = new Transaction(req.body.fromAcct, req.body.toAcct, req.body.amount);
  db.collection('pending_transaction').save(trans, function (err, result) {
    if (err) return console.log(err);
    console.log('saved pending_transaction to DB');
    res.redirect('/');
  })
})

// Mine pending transactions according to set difficulty
app.post('/mine', function (req, res) {
  let transactions = [];
  let transIDs = [];

  db.collection('pending_transaction').find({}, {
    _id: 0
  }).toArray(function (err, results) {
    if (err) return console.log(err);

    results.forEach(function (item, index, array) {
      trans = new Transaction(item.sourceAcct, item.targetAcct, item.amount);
      transactions.push(trans);
      transIDs.push(item._id); // Keep the transaction IDs in an array
    });

    myCrypto.setPendingTransactions(transactions);
    myCrypto.setMiningDifficulty(Number(req.body.mineDifficulty)); 
    console.log('Mining difficulty is set to ' + req.body.mineDifficulty );
    myCrypto.minePendingTransactions(req.body.minerAcct, getLastBlockHash(dbConnectionString, callback));

    transIDs.forEach(function (item, index, array) {
      let myquery = {
        _id: item
      };
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

app.post('/showchain', function (req, res) {
  db.collection('blocks').find({}, {_id: 0}).toArray(function (err, results) {
    if (err) return console.log(err);
    res.render('chain.ejs', {
      blocks: results
    });

  })
})

function getNumOfDocs(collectionName, callback) {
  MongoClient.connect(dbConnectionString, function (error, db) {
    if (error) return callback(error);
    db.collection(collectionName).count({}, function (error, numOfDocs) {
      if (error) return callback(error);
      db.close();
      callback(null, numOfDocs);
    });
  });
}

// Retrieve previous block's hash to save into new block
function getLastBlockHash(dbConnectionString, callback) {
  MongoClient.connect(dbConnectionString, function (error, database) {
    if (error) return callback(error);
    db = database.db('expressweb_kaopaigu');
    db.collection('blocks').find({}, { "_id": 0 }).toArray(function (err, results) {
      if (err) return console.log(err);
      console.log("Last hash is " + JSON.stringify(results[results.length - 1].hash));
      return results[results.length - 1].hash;
    }) 
  });
}


module.exports = app;