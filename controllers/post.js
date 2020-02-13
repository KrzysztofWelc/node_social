const router = require("express").Router();
const auth = require("../middleware/auth");
const Post = require("../db/models/Post");
const Like = require("../db/models/Like");

router.post("/add", auth, async (req, res) => {
  const post = new Post({ ...req.body, owner: req.user._id });

  try {
    await post.save();
    res.status(201).send(post);
  } catch (e) {
    res.status(400).send();
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id, owner: req.user._id });
    if (!post)
      return res.status(401).send({ msg: "you are not author of this post" });
    res.status(200).send(post);
  } catch (e) {
    res.status(401).send({ msg: e.message });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id, owner: req.user._id });
    if (!post) {
      return res.status(401).send({ msg: "you are not author of this post" });
    }
    const permittedUpdates = ["body", "image"];
    for (let up in req.body) {
      if (permittedUpdates.includes(up)) {
        post[up] = req.body[up];
      }
    }
    await post.save();
    res.status(200).send(post);
  } catch (e) {
    res.status(401).send({ msg: e.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id, owner: req.user._id });
    if (!post) {
      return res.status(401).send({ msg: "you are not author of this post" });
    }
    await post.remove();
    res.status(200).send();
  } catch (e) {
    res.status(401).send({ msg: e.message });
  }
});

router.post("/like", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.body.postId;

    const check = await Like.findOne({ owner: userId, post: postId });
    if (check) {
      throw new Error("you have liked this post already");
    }
    const like = new Like({ owner: userId, post: postId });
    await like.save();
    res.status(201).send();
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
});
router.post("/dislike", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.body.postId;

    await Like.deleteOne({ owner: userId, post: postId });
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
