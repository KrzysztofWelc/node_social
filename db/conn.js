const mongoose = require("mongoose");
const { dbURL } = require("../config");

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
