const mongoose = require("mongoose");
cosnt {dbURL} = require('../config')

mongoose.connect(
  dbURL,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
