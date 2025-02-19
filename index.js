const http = require("http");
const { hello, greetings } = require("./helloWorld");
const moment = require("moment");
const express = require("express");
const app = express();
const morgan = require("morgan");

const users = [
    { id: 1, name: "John" },
    { id: 2, name: "Smith" },
    { id: 3, name: "Bob" }
];

//Middleware;
const log = (req, res, next) => {
  console.log(
    moment().format("MMMM Do YYYY, h:mm:ss a") +
      " " +
      req.ip +
      " " +
      req.originalUrl
  );
  next();
};

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:name', (req, res) => {
    const userName = req.params.name.toLowerCase();
    const user = users.find(u => u.name.toLowerCase() === userName);
    
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "Data user tidak ditemukan" });
    }
});

app.use(morgan("tiny"));

app.get("/", (req, res) => res.send("Hello World"));
app.get("/about", (req, res) =>
  res.status(200).json({
    status: "success",
    message: "About page",
    data: [],
  })
);
app.post("/contoh", (req, res) => res.send("request method POST"));
app.put("/contoh", (req, res) => res.send("Request method PUT"));
app.delete("/contoh", (req, res) => res.send("Request method DELETE"));
app.patch("/contoh", (req, res) => res.send("Request method PATCH"));

app.all("/universal", (req, res) => res.send(`Request method ${req.method}`));
// Routing dinamis
// 1. Menggunakan params
app.get("/post/:id", (req, res) => res.send(`Artikel ke - ${req.params.id}`));
// 2. Menggunakan Query String
app.get("/post", (req, res) => {
  const { page, sort } = req.query;
  res.send(`Query string= page :${page}, sort : ${sort}`);
});

//Middleware
app.use((req, res) => {
    res.status(404).json({ status: "error", message: "resource tidak ditemukan" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "error", message: "terjadi kesalahan pada server" });
});

const hostname = "127.0.0.1";
const port = 3000;
app.listen(port, hostname, () =>
  console.log(`Server running at http://${hostname}:${port}`)
);