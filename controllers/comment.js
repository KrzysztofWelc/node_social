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
    try {
      const newComment = new Comment({
        commentedPostId: postId,
        author: userId,
        body
      });
      if (req.file) newComment.image = req.file.buffer;
      await newComment.save();
      res.status(200).send();
    } catch (e) {
      res.status(500).send({ msg: e.message });
    }
  },
  (err, req, res, next) => {
    res.status(500).send({ msg: err.message });
  }
);

router.patch(
  "/:id",
  auth,
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    try {
      const comment = await Comment.findOne({ author: req.user._id, _id: id });
      if (!comment) {
        return res
          .status(401)
          .send({ msg: "you are not author of this comment" });
      }
      comment.body = req.body.body;

      if (req.file) {
        comment.image = req.file.buffer;
      } else if (req.body.delImage) {
        comment.image = undefined;
      }
      await comment.save();
      res.status(200).send();
    } catch (e) {
      res.status(500).send({ msg: e.message });
    }
  },
  (err, req, res, next) => {
    res.status(500).send({ msg: err.message });
  }
);

module.exports = router;
