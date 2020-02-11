const router = require("express").Router();
const auth = require("../middleware/auth");
const Post = require("../db/models/Post");

router.post("/add", auth, async (req, res) => {
  const post = new Post({ ...req.body, owner: req.user._id });

  try {
    await post.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
