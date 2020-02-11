const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

require("./db/conn");

const userController = require("./controllers/user");
const postController = require("./controllers/post");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", userController);
app.use("/post", postController);

app.listen(PORT, e => {
  if (e) return console.log("==ERROR==", e);
  console.log("server is running at " + PORT);
});
