/*var express = require('express');
var app = express();
var path = require('path');
var serveStatic = require('serve-static')

const portNumber = 8088;

app.use(serveStatic('assets', { 'index': ['index.html', 'index.htm'] }));

app.listen(portNumber);
console.log("Listening on port " + portNumber);*/

var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static')

// Serve up public/ftp folder
var serve = serveStatic('assets', { 'index': ['index.html', 'index.htm'] })

// Create server
var server = http.createServer(function onRequest (req, res) {
  serve(req, res, finalhandler(req, res))
})

// Listen
server.listen(3000)