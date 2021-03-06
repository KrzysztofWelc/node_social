const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    followedId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const Follow = mongoose.model('Follow', commentSchema)

module.exports = Follow;