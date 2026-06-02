const express = require("express");
const cors = require("cors");
const path = require("path");
const submitRouter = require("./Router/submitRouter");
const { databaseInit } = require("./data/init");
const { spellRouter } = require("./Router/spellRouter");
const authRouter = require("./Router/authRouter");

const app = express();
databaseInit();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/css", express.static(path.join(__dirname, "..", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "js")));
app.use("/img", express.static(path.join(__dirname, "..", "img")));
app.use("/htmlf", express.static(path.join(__dirname, "..", "htmlf")));
// Render runs the server from the server folder, so these lines serve the real website folders.

app.use("/submit", submitRouter);
app.use("/spell", spellRouter);
app.use("/auth", authRouter);
// Added auth routes so the browser asks the SQL server for signup/login instead of localStorage.
app.get(["/", "/index.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
})
// Allows old "go home" links that point to index.html to work through ngrok too.

const port = process.env.PORT || 3000;
// Render provides PORT automatically; locally the server still uses 3000.
app.listen(port, function () {
  console.log("Server is available on port " + port);
});

