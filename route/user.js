var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var db_url = 'mongodb://127.0.0.1:27017';
var jwt = require('jwt-simple');
var secret = 'node_demo_server';

router.post('/login', function(req, res, next) {
    console.log('/user/login');
    console.log(req.body);

    MongoClient.connect(db_url, function(db_err, db) {
        if (db_err) throw db_err;
        var dbase = db.db('node');
        console.log('db connected');
        var col = dbase.collection('user');
        col.find({'username':req.body['username']}).toArray(function(finderr, results) {
            if (finderr) throw finderr;
            if (results.length === 0) {//用户不存在
                console.log('用户不存在');
                res.status(403).json({'error':'用户不存在！', 'jwt':null});
            } else if (results[0]['password'] != req.body['password']) {//密码错误
                console.log('密码错误');
                res.status(403).json({'error':'密码错误，请重新输入。','jwt':null});
            } else {//登录成功
                console.log('登录成功');
                var token = jwt.encode({'iss':req.body['username']}, secret);
                res.json({'error':null, 'jwt':token});
            }
            db.close();
        });
    });
});

router.post('/register', function(req, res, next) {
    console.log('/user/register');
    console.log(req.body);

    MongoClient.connect(db_url, function(err, db) {
        if (err) throw err;
        var dbase = db.db('node');
        console.log('db connected');
        var col = dbase.collection('user');
        col.find({'username':req.body['username']}).toArray(function(finderr, results) {
            if (finderr) throw err;
            if(results.length > 0) {//用户名已存在
                console.log('用户名已存在');
                res.status(403).json({'error':'用户名已存在','jwt':null});
            } else {
                console.log('可注册');
                col.insertOne({'username':req.body['username'], 'password':req.body['password']}, function(inserterr, res) {
                    if(inserterr) throw inserterr;
                    console.log('注册成功：'+req.body['username']+' '+req.body['password']);
                })
                var token = jwt.encode({'iss':req.body['username']}, secret);
                res.json({'error':null, 'jwt':token});
            }
            db.close();
        });
    });
});

module.exports = router;