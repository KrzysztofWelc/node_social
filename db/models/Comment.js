const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    commentedPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    image: {
      type: Buffer
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
