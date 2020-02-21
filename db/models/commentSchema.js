const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({

  image: {
    type: Buffer
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  body: {
    type: String
  }
}, {
  timestamps: true
});


module.exports = commentSchema;