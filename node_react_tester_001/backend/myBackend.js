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
    res.send(`Data has been saved`);
  })
  .get((req, res) => {
    console.log("Get request came");
    // let a = JSON.parse(todoState);
    // a.tasks = a.tasks.map((task) => {
    //   return {
    //     id: task.id,
    //     content: `${task.content}Doned`,
    //   };
    // });
    // console.log(a);
    if (todoState !== "") res.status(200).send(todoState);
    else res.status(500).send("Nothing to sync");
  });

server.listen(3001);
