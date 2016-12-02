#!/usr/bin/env node
/**
Run this script with Node.js 0.4.x and browse to http://localhost:3000/ to
see the test page for LazyLoad.
**/
var path = require('path');
var express = require('express');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.listen(4000);
console.log("server start at : 4000");

app.get('*', function(req, res){
	res.sendfile('public/404.html');
});

var app2 = express();
app2.use(express.static(path.join(__dirname, '../../coding/songjz')));
app2.listen(4001);
console.log("server2 start at : 4001");
app2.get('*', function(req, res){
	res.sendfile('../../coding/songjz/404.html');
});
