const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});


module.exports = commentSchema;