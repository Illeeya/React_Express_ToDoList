// CODE IS MEANT TO BE USED ON GLITCH.COM
// EXPRESS
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const server = express();

server.use(cors());
server.use(express.json());

// SQLITE3
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("tasksData", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the test SQlite database:");
});

// APP START
let todoState = "";
let errorStatus = "";

function saveTasksToDb(userId) {
  console.log("Called save");
  try {
    db.run(`delete from Tasks where ownerId = ${userId}`);

    todoState.tasks.forEach((task) => {
      db.run(
        `insert into Tasks values('${task.key}', '${task.content}', ${userId})`
      );
    });
  } catch (e) {
    errorStatus = e;
  }
}

// ROUTING

server.post("/tasksSave", (req, res) => {
  todoState = req.body;
  console.log(`Save request for data string: `, JSON.stringify(req.body));
  saveTasksToDb(req.body.userId);
  if (errorStatus === "") res.send(`Data has been saved`);
  else res.send(`Data might not have been saved. Error: ${errorStatus}`);
});

server.post("/tasksLoad", (req, res) => {
  console.log("Post on tasks came");
  const user = req.body.userId;
  console.log(user);

  const sql = `SELECT taskKey, taskText FROM Tasks WHERE ownerId = ${user} ORDER BY taskKey`;

  try {
    db.all(sql, (err, rows) => {
      if (rows) {
        let tasks = [];
        rows.forEach((row) => {
          let id = row.taskKey;
          let content = row.taskText;
          let taskObject = { id: id, content: content };
          console.log(taskObject);
          tasks.push(taskObject);
        });

        if (tasks === []) res.status(500).send("No tasks to load");
        else res.status(200).send(JSON.stringify({ tasks: tasks }));
      } else if (err) {
        console.log(err);
        res.status(500).send(`No tasks found, error: `);
      } else {
        console.log("No tasks for user");
        res.status(500).send("No tasks found for that user.");
      }
    });
  } catch (error) {
    console.log("Catch error: ", error);
    res.status(500).send(`Db error: ${error}`);
  }
});

server.post("/users/login", async (req, res) => {
  console.log("Post on users came");

  const user = req.body.username;
  const pass = req.body.password;

  const sql = `SELECT userId, password FROM Users WHERE username = UPPER('${user}');`;

  try {
    db.get(sql, async (err, row) => {
      if (err) console.log("Inner err: ", err);
      if (row) {
        console.log("Row: ", row.userId);
        if (await bcrypt.compare(req.body.password, row.password)) {
          res.status(200).send(`${row.userId}`);
        } else {
          res.status(400).send("Wrong password!");
        }
      } else {
        res.status(400).send(`Wrong username!`);
      }
    });
  } catch (error) {
    console.log("Outter err: ", error);
  }
});

server.post("/users/register", async (req, res) => {
  console.log("Registering user");

  const user = req.body.username;
  const pass = req.body.password;

  console.log(user, pass);

  if (user.length <= 0 || pass.length <= 0) {
    res.status(500).send("Username or password are empty. Cannot create user.");
  } else {
    try {
      const hashedPassword = await bcrypt.hash(pass, 10);
      console.log("Hashed pass: ", hashedPassword);
      const sql = `INSERT INTO Users(username, password) VALUES('${user.toUpperCase()}', '${hashedPassword}')`;
      console.log(sql);
      db.exec(sql, (err) => {
        if (err) {
          res
            .status(500)
            .send(`Could not add user to database. Error: ${err.message}`);
        } else {
          res.status(200).send("User created!");
        }
      });
    } catch (error) {
      res
        .status(500)
        .send(`Could not register the user. Error: ${error.message}`);
    }
  }
});

server.listen(3000);
