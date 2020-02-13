const mongoose = require("mongoose");
const Like = require("./Like");
const postSchema = mongoose.Schema({
  body: String,
  added: {
    type: Date,
    default: Date.now
  },
  image: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

postSchema.pre("remove", async function(next) {
  const post = this;
  await Like.deleteMany({ post: post._id });
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
