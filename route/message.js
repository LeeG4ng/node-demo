var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
const secret = 'node_demo_server';
var MongoClient = require('mongodb').MongoClient;
const db_url = 'mongodb://127.0.0.1:27017';
var uuid = require('node-uuid');

router.post('/upload', function(req, res) {
    var token = req.body['jwt'];
    var username = jwt.decode(token, secret)['iss'];//解析jwt
    var msg = req.body['msg'];
    console.log('user ' + username +' upload “'+msg+'”');
    var id = uuid.v1();//生成id

    MongoClient.connect(db_url, function(db_err, db) {
        if (db_err) throw db_err;
        var dbase = db.db('node');
        console.log('db connected');
        var col = dbase.collection('message');
        col.insertOne({username:username,id:id,msg:msg},function(ins_err, ins_res) {
            if (ins_err) throw ins_err;
            console.log(username+'上传成功');
            res.json({id:id});
            console.log(id);
            db.close();
        });
    });
});


module.exports = router;