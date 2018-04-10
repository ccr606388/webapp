var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dbhandle = null;
// Connection URL
var url = 'mongodb://101.200.40.203:27017';

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
    if (!dbhandle)
    {
        console.error("dbhandle is null");
        callback(1);
        return;
    }

    var collection = dbhandle.collection(templateName);

    collection.insertOne(data, callback);
}

function dbFind(templateName, query, callback)
{
    if (!dbhandle)
    {
        console.error("dbhandle is null");
        callback(null);
        return;
    }
    var collection = dbhandle.collection(templateName);
    collection.find(query).toArray(function(err,date){
        callback(err, date);
    });
}

function dbUpsert(templateName, filter, update, callback)
{
    if (!dbhandle)
    {
        console.error("dbhandle is null");
        callback(null);
        return;
    }

    var collection = dbhandle.collection(templateName);

    collection.findOneAndUpdate(filter, update, {upsert:true}, callback)
}

function dbClear(templateName, callback)
{    
    if (!dbhandle)
    {
        console.error("dbhandle is null");
        callback(1);
        return;
    }

    dbhandle.dropCollection(templateName, callback);
}

module.exports = {
    dbInit : dbInit,
    dbInsert : dbInsert,
    dbFind : dbFind,
    dbClear : dbClear
};