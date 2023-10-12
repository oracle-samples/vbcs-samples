/**
 * Copyright (c)2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */

const http = require("http");
const os = require("os");

const host = "127.0.0.1";
const port = 8080;


const tasks = [
  {id: 0, name: "Dispatch Orders", start: new Date().valueOf(), length: 30000}
  ];

let counter = 1;

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getActiveTasks() {
  const now = new Date().valueOf();
  return tasks.filter(t => (t.start+t.length > now || t.progress !== 100)).map(t => { 
    const duration = now - t.start;
    const percentage = Math.floor(duration / t.length * 100);
    t.progress = percentage > 100 ? 100 : percentage;
    return t;
  });
}

const requestListener = function (req, res) {
  if (req.url === '/tasks' && req.method === 'OPTIONS') {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST");
      res.end();
  } else if (req.url === '/tasks' && req.method === 'GET') {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify({tasks: tasks}));
  } else if (req.url === '/tasks' && req.method === 'POST') {
    let body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      let rec = JSON.parse(body);
      rec.id = counter++;
      rec.start = new Date().valueOf();
      rec.length = getRandom(45, 120)*1000;
      tasks.push(rec);
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.writeHead(200);
      res.end(JSON.stringify({tasks: tasks}));
    });
  } 
  else if (req.url.startsWith('/tasks-progress')  && req.method === 'GET') {

    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("connection", "keep-alive");
    res.setHeader("Content-Type", "text/event-stream");

    let timer = setInterval(() => {
      const activeTasks = getActiveTasks();
      const payload = JSON.stringify(activeTasks);
      console.log("data update: "+payload);
      res.write(`id: ${(new Date()).toLocaleTimeString()}\ndata: ${payload}\n\n`);
      if (activeTasks.length === 0) {
        clearInterval(timer);
        res.end();
      }
    }, 3000);

  } else {
    res.statusCode = 404;
    res.end("resource does not exist");
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`server running at http://${host}:${port}`);
});