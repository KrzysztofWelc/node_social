const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

require("./db/conn");

const userController = require("./controllers/user");
const postController = require("./controllers/post");
const commentController = require("./controllers/comment");
const pageController = require('./controllers/page');


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cors())

app.use("/user", userController);
app.use("/post", postController);
app.use('/comment', commentController);
app.use('/page', pageController);

app.listen(PORT, e => {
  if (e) return console.log("==ERROR==", e);
  console.log("server is running at " + PORT);
});