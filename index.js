var express = require('express');//导⼊入Express模块 
var app = express();
var https = require('https');
var fs = require('fs');

//设置监听端⼝ https 
https.createServer({
     key: fs.readFileSync('server.key'),
     cert: fs.readFileSync('server.cert')
   }, app).listen(8086, function() {
     console.log("run 8086");
 });
app.get('/', function(req, res) {//设置 
    console.log('get root'); 
    res.send('get root');
});