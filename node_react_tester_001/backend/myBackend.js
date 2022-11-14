/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const server = express();

// const tasks = require("./data/tasks.json");
// const test = require("./data/student-2.json");
const db = new sqlite3.Database("./data/test.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the in-memory SQlite database.");
  console.log(db.tables);
});

server.use(cors());
server.use(express.json());

// let rawdata = fs.readFileSync('./data/tasks.json');
// let student = JSON.parse(rawdata);
// console.log(student);

// console.log(tasks);

db.serialize(function () {
  db.each("SELECT a, taskText FROM Athlete", function (err, row) {
    console.log("User: ", row);
  });
});

db.close();

// let student = {
//   name: "Mike",
//   age: 23,
//   gender: "Male",
//   department: "English",
//   car: "Honda",
// };

// let data = JSON.stringify(student);
// fs.writeFileSync("./data/student-2.json", data);

// console.log(data);

let todoState = "";

server
  .route("/")
  .post((req, res) => {
    todoState = JSON.stringify(req.body);
    // fs.writeFile("./data/tasks.json", todoState);
    console.log(`Save request for data string: `, JSON.stringify(req.body));
    res.send(`Data has been saved`);
  })
  .get((req, res) => {
    //console.log("Get request came");
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
    //res.status(200).send("Worked");
  });

server.listen(5000);

// Require the fastify framework and instantiate it
// const fastify = require("fastify")({
//   // Set this to true for detailed logging:
//   logger: false,
// });

// // ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// // Setup our static files
// fastify.register(require("@fastify/static"), {
//   root: path.join(__dirname, "public"),
//   prefix: "/", // optional: default '/'
// });

// // Formbody lets us parse incoming forms
// fastify.register(require("@fastify/formbody"));

// // View is a templating manager for fastify
// fastify.register(require("@fastify/view"), {
//   engine: {
//     handlebars: require("handlebars"),
//   },
// });

// // Load and parse SEO data
// const seo = require("./src/seo.json");
// if (seo.url === "glitch-default") {
//   seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
// }

// /**
//  * Our home page route
//  *
//  * Returns src/pages/index.hbs with data built into it
//  */
// fastify.get("/", function (request, reply) {
//   // params is an object we'll pass to our handlebars template
//   let params = { seo: seo };

//   // If someone clicked the option for a random color it'll be passed in the querystring
//   if (request.query.randomize) {
//     // We need to load our color data file, pick one at random, and add it to the params
//     const colors = require("./src/colors.json");
//     const allColors = Object.keys(colors);
//     let currentColor = allColors[(allColors.length * Math.random()) << 0];

//     // Add the color properties to the params object
//     params = {
//       color: colors[currentColor],
//       colorError: null,
//       seo: seo,
//     };
//   }

//   // The Handlebars code will be able to access the parameter values and build them into the page
//   return reply.view("/src/pages/index.hbs", params);
// });

// /**
//  * Our POST route to handle and react to form submissions
//  *
//  * Accepts body data indicating the user choice
//  */
// fastify.post("/", function (request, reply) {
//   // Build the params object to pass to the template
//   let params = { seo: seo };

//   // If the user submitted a color through the form it'll be passed here in the request body
//   let color = request.body.color;

//   // If it's not empty, let's try to find the color
//   if (color) {
//     // ADD CODE FROM TODO HERE TO SAVE SUBMITTED FAVORITES

//     // Load our color data file
//     const colors = require("./src/colors.json");

//     // Take our form submission, remove whitespace, and convert to lowercase
//     color = color.toLowerCase().replace(/\s/g, "");

//     // Now we see if that color is a key in our colors object
//     if (colors[color]) {
//       // Found one!
//       params = {
//         color: colors[color],
//         colorError: null,
//         seo: seo,
//       };
//     } else {
//       // No luck! Return the user value as the error property
//       params = {
//         colorError: request.body.color,
//         seo: seo,
//       };
//     }
//   }

//   // The Handlebars template will use the parameter values to update the page with the chosen color
//   return reply.view("/src/pages/index.hbs", params);
// });

// // Run the server and report out to the logs
// fastify.listen(
//   { port: process.env.PORT, host: "127.0.0.1" },
//   function (err, address) {
//     if (err) {
//       fastify.log.error(err);
//       process.exit(1);
//     }
//     console.log(`Your app is listening on ${address}`);
//     fastify.log.info(`server listening on ${address}`);
//   }
// );
