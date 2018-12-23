var express = require('express');//导⼊入Express模块 
var app = express();
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var userRouter = require('./route/user');
 var msgRouter = require('./route/message');

//设置监听端⼝ https 
https.createServer({
     key: fs.readFileSync('server.key'),
     cert: fs.readFileSync('server.cert')
   }, app).listen(8086, function() {
     console.log("run 8086");
 });


 app.use(bodyParser.json({limit: '50mb'}));
 app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

 
 app.use('/user', userRouter);
 app.use('/message', msgRouter);
