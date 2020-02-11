const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://admin:pololo123@ds163016.mlab.com:63016/node_social",
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
