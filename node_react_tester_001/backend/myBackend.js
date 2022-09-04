const express = require("express");
const cors = require("cors");
const server = express();

server.use(cors());
server.use(express.json());

let todoState = "";

server
  .route("/")
  .post((req, res) => {
    todoState = JSON.stringify(req.body);
    console.log(`Save request for data string: `, JSON.stringify(req.body));
    // res.set("Content-Type", "text/html");
    console.log(todoState);
    console.log(todoState[0]);
    res.send(`Data has been saved`);
    // console.log(JSON.stringify({ id: "lel" }));
    // res.send(JSON.stringify({ id: "chuj" }));
  })
  .get((req, res) => {
    console.log("Get request came");
    let a = JSON.parse(todoState);
    a.tasks = a.tasks.map((task) => {
      return {
        ...task,
        id: (task.id += "Modified"),
      };
    });
    res.send(JSON.stringify(a));
  });

server.listen(3001);
