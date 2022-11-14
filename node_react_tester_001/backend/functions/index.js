const functions = require("firebase-functions");

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

    // res.status(200).send("Werks");
    if (todoState !== "") res.status(200).send(todoState);
    else res.status(500).send("Nothing to sync");
  });

exports.server = functions.https.onRequest(server);

// server.listen(3001);
