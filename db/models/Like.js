const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  }
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
