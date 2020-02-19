const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const Comment = require("../db/models/Comment");

router.post(
  "/add",
  auth,
  upload.single("image"),
  async (req, res) => {
    const userId = req.user._id;
    const postId = req.body.postId;
    const body = req.body.body;

    const newComment = new Comment({
      commentedPostId: postId,
      author: userId,
      body
    });
    if (req.file) newComment.image = req.file.buffer;
    await newComment.save();
    res.status(200).send();
  },
  (err, req, res, next) => {
    res.send({ msg: err.message });
  }
);

module.exports = router;
