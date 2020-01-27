const http = require("http");
const test = require("./index.js");
// const express = require("express");

console.log(test);

const port = process.env.port || 9001;
http
  .createServer(function(request, response) {
    response.writeHead(200, {
      "Content-Type": "text/plain"
    });
    response.end("Hello World\n");
  })
  .listen(port);
