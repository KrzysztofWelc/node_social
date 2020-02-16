const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const Post = require("../db/models/Post");
const Like = require("../db/models/Like");

router.post(
  "/add",
  auth,
  upload.single("image"),
  async (req, res) => {
    const post = new Post({ ...req.body, owner: req.user._id });
    if (req.file) post.image = req.file.buffer;
    try {
      await post.save();
      res.status(201).send(post);
    } catch (e) {
      res.status(400).send({ msg: e.message });
    }
  },
  (err, req, res) => {
    res.status(500).send({ msg: err.message });
  }
);

router.get("/:id/image", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || !post.image) {
      throw new Error("no such an image");
    }

    res.set("Content-Type", "image/jpg");
    res.send(post.image);
  } catch (e) {
    res.status(404).send({ msg: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post)
      return res.status(401).send({ msg: "you are not author of this post" });
    res.status(200).send(post);
  } catch (e) {
    res.status(401).send({ msg: e.message });
  }
});

router.patch(
  "/:id",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findOne({ _id: id, owner: req.user._id });
      if (!post) {
        return res.status(401).send({ msg: "you are not author of this post" });
      }
      const permittedUpdates = ["body"];
      for (let up in req.body) {
        if (permittedUpdates.includes(up)) {
          post[up] = req.body[up];
        }
      }
      if (req.file) {
        console.log("updated image");

        post.image = req.file.buffer;
      } else if (req.body.delImage) {
        console.log("deleted image");

        post.image = undefined;
      }
      await post.save();
      res.status(200).send(post);
    } catch (e) {
      res.status(401).send({ msg: e.message });
    }
  },
  (err, req, res) => {
    res.status(500).send({ msg: err.message });
  }
);

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
    const likedPost = await Post.findById(postId);
    likedPost.likeCount++;
    likedPost.save();
    res.status(201).send();
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
});
router.post("/dislike", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.body.postId;

    const usersLike = await Like.findOne({ owner: userId, post: postId });
    if (usersLike) {
      usersLike.remove();
      const likedPost = await Post.findById(postId);
      likedPost.likeCount--;
      likedPost.save();
      res.status(200).send();
    } else {
      throw new Error("You haven't liked this post before");
    }
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
});

module.exports = router;
