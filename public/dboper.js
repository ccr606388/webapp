var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbhandle = null;
// Connection URL
var url = 'mongodb://localhost:27017';

// Database Name
var dbName = 'activity';

// Use connect method to connect to the server
function dbInit(mongoName)
{
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        dbhandle = client.db(mongoName || dbName);
    });
}

function dbInsert(templateName, data, callback)
{
    var collection = dbhandle.collection(templateName);

    collection.insertOne(data, callback);
}

function dbFind(templateName, query, callback)
{
    var collection = dbhandle.collection(templateName);

    var temp = collection.find(query).toArray();
    callback(temp);
}

function dbClear(templateName, callback)
{
    dbhandle.dropCollection(templateName, callback);
}

module.exports = {
    dbInit : dbInit,
    dbInsert : dbInsert,
    dbFind : dbFind,
    dbClear : dbClear
};