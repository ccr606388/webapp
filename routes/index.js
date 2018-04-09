var express = require('express');
var router = express.Router();
var dboper = require('../public/dboper');
var TEMPLATE_CFG = "template_conf";

/* GET home page. */
router.use('/cfgtemplate', function(req, res, next){
    var conf = req.body;
    if (!conf) {
        res.json({
            result: 1,
            reason: "cfg is null"
        });
    }
    var temId = req.query.pageid || req.body.pageid;
    // console.log("access cfgtemplate");
    dboper.dbUpsert(TEMPLATE_CFG, {pageid : temId}, conf, function(err){
        res.json({
            result: err?1:0,
            reason: err?"failed with err: "+JSON.stringify(err):"success"
        })
    });
});

router.get('/gettemplate', function(req, res, next){
    console.log("access gettemplate");
    var temId = req.query.pageid || req.body.pageid;
    dboper.dbFind(TEMPLATE_CFG, {pageid : temId}, function(data){
        console.log("find finish ",data)
        res.json({
            result: 0,
            reason: "success",
            msg:data
        });
    })
});

module.exports = router;
