var mongodb = require("../public/dboper");

mongodb.dbInit("test");

setTimeout(function(){
/*
    mongodb.dbInsert("test_collection", {a:1,b:2}, function(err){
        console.log("insert data1");
        console.log(err);
    })
    
    mongodb.dbInsert("test_collection", {a:2,b:3}, function(err){
        console.log("insert data2");
        console.log(err);
    })
    */
    // mongodb.dbFind("test_collection", {a:1}, function(data){
    //     console.log("find data1");
    //     console.log(data);
    // })
    
    // mongodb.dbFind("test_collection", {}, function(data){
    //     console.log("find data2");
    //     console.log(data);
    // })
    
    // mongodb.dbFind("test_collection", {a:3}, function(data){
    //     console.log("find data3");
    //     console.log(data);
    // })
    /*
    mongodb.dbClear("test_collection", function(err){
        console.log("clear data1");
    })
    mongodb.dbFind("test_collection", {}, function(data){
        console.log("clear data1");
        console.log(data);
    })
    */
    mongodb.dbUpsert("test_collection", {a:1}, {a:1,b:2,c:3}, function(err){
        console.log(err)
    })
}, 1000)

