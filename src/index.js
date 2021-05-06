const express = require("express");
const path = require("path");
const messageRouter = require("./notify")
const app = express();
const port = 3000;

app.get("/", (_, res) => {
  res.sendFile(path.resolve((__dirname, "./src/index.html")));
});
app.get("/callback", (_, res) => {
  res.sendFile(path.resolve((__dirname, "./src/callback.html")));
});

app.use(messageRouter);

app.listen(port, () => console.log(`Listening on port ${port}!`));
