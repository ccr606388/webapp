var express = require('express');
var router = express.Router();
var dboper = require('../public/dboper');
var xlsx = require('node-xlsx');
var fs = require('fs');
var TEMPLATE_CFG = "template_conf";
var TEMPLATE = "template";

router.get('/gettemplate', function (req, res, next) {
    console.log("access gettemplate");
    var temId = req.query.pageid || req.body.pageid;
    dboper.dbFind(TEMPLATE_CFG, temId ? { pageid: temId } : {}, function (err, data) {
        console.log("find finish ", data)
        res.json({
            result: err ? 1 : 0,
            reason: err ? "failed with err: " + JSON.stringify(err) : "success",
            msg: data
        });
    })
});

router.use('/adduser', function (req, res, next) {
    console.log("access adduser");
    var temId = req.query.pageid || req.body.pageid;
    var query = {};
    var a = new Date(Date.now());
    var time = a.getFullYear().toString() + "-" +(a.getMonth() + 1).toString() + "-"+ a.getDate().toString()

    req.body.time = time
    if (temId == 1) {
        query.name = req.body.name,
            query.phone = req.body.phone,
            query.time = time
    }
    else if (temId == 2) {

    }

    dboper.dbUpsert(TEMPLATE + "_" + temId, query, req.body, function (err) {
        res.json({
            result: err ? 1 : 0,
            reason: err ? "failed with err: " + JSON.stringify(err) : "success"
        })
    });
})

router.use('/login', function (req, res, next) {
    if (req.body.username == "admin" && req.body.password == "admin") {
        req.session && (req.session.pass = "passed")
        res.redirect("/admin/private/index.html");
    }
    else {
        res.json({
            result: 1, 	//failed
            reason: "username or password error"
        })
    }
})

//----------------------------------------------------need auth--------------------------------------------------------------

router.use(function (req, res, next) {
    if (req.session && req.session.pass == "passed") {
        next();
    } else {
        res.redirect("/admin/public/index.html")
    }
})

router.use('/listuser', function (req, res, next) {
    console.log("access listuser");
    if (!req.body) {
        res.json({
            result: 1,
            reason: "body is null"
        });
    }
    var temId = req.body.pageid;
    var fliter = req.body.fliter || {};
    dboper.dbFind(TEMPLATE + "_" + temId, fliter, function (err, data) {
        console.log("----------1---------------")
        console.log(JSON.stringify(data));
        res.json({
            result: err ? 1 : 0,
            reason: err ? "failed with err: " + JSON.stringify(err) : "success",
            msg: JSON.stringify(data)
        })
    })
})

router.use('/clearData', function (req, res, next) {
    console.log("access listuser");
    var temId = req.query.pageid;
    dboper.dbClear(TEMPLATE + "_" + temId, function (err) {
        res.json({
            result: err ? 1 : 0,
            reason: err ? "failed with err: " + JSON.stringify(err) : "success",
        })
    })
})

router.use('/cfgtemplate', function (req, res, next) {
    var conf = req.body;
    if (!conf) {
        res.json({
            result: 1,
            reason: "cfg is null"
        });
    }
    var temId = req.query.pageid || req.body.pageid;
    console.log(conf);
    console.log(temId);
    // console.log("access cfgtemplate");
    dboper.dbUpsert(TEMPLATE_CFG, { pageid: temId }, conf, function (err) {
        res.json({
            result: err ? 1 : 0,
            reason: err ? "failed with err: " + JSON.stringify(err) : "success"
        })
    });
});

router.use('/exportexcel', function (req, res, next) {
    console.log("access listuser");
    var temId = req.query.pageid;
    dboper.dbFind(TEMPLATE + "_" + temId, {}, function (err, data) {
        var excel = [];

        data.forEach(function (v, k) {
            console.log(v)
            console.log(Object.values(v))

            //插入表头
            if (k == 0) {
                excel.push(Object.keys(v))
            }

            //解析嵌套类型
            var tempArray = [];
            for(var k1 in v)
            {
                var v1 = v[k1];
                if (typeof v1 == "object")
                {
                    v1 = JSON.stringify(v1);
                    console.log("tostring", v1);
                }
                tempArray.push(v1);
            }

            // excel.push(Object.values(v));
            excel.push(tempArray);
            console.log("values", tempArray);
        });


        var buffer = xlsx.build([
            {
                name: 'sheet1',
                data: excel
            }
        ]);

        //将文件内容插入新的文件中
        fs.writeFileSync('/file/test1.xlsx', buffer, { 'flag': 'w' });

        // var options = {
        //     root: __dirname + '/public/',
        //     dotfiles: 'deny',
        //     headers: {
        //         'x-timestamp': Date.now(),
        //         'x-sent': true
        //     }
        //   };
        // application/vnd.ms-excel
        // var fileName = req.params.name;
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        res.sendFile('/file/test1.xlsx', function (err) {
            if (err) {
                console.log(err);
                response.writeHead(200, { "Content-Type": "application/vnd.ms-excel" }).end();
                // res.status(err.status).end();
            }
            else {
                console.log('Sent:success');
            }
        });
    })
})

module.exports = router;
