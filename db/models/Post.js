const mongoose = require("mongoose");
const Like = require("./Like");
const commentSchema = require('./commentSchema')

const postSchema = mongoose.Schema({
  body: String,
  image: {
    type: Buffer
  },
  likeCount: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  comments: [
    commentSchema
  ]
}, {
  timestamps: true
});


postSchema.pre("remove", async function (next) {
  const post = this;
  await Like.deleteMany({
    post: post._id
  });
  next();
});

postSchema.methods.toJSON = function () {
  const post = this;

  const postObject = post.toObject();

  delete postObject.image;

  return postObject;
};

const Post = mongoose.model("Post", postSchema);
module.exports = Post;