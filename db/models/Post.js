const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  body: String,
  added: {
    type: Date,
    default: Date.now
  },
  image: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
