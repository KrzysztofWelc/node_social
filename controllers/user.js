const router = require("express").Router();
const User = require("../db/models/User");
const auth = require("../middleware/auth");

const upload = require("../utils/upload");

router.post(
  "/register",
  upload.single("avatar"),
  async (req, res) => {
    const { email, nickName, password } = req.body;
    // console.log(Boolean(req.file));

    const newUser = new User({ email, nickName, passwordHash: password });
    if (req.file) {
      newUser.avatar = req.file.buffer;
    }
    try {
      const user = await newUser.save();
      const token = await user.generateAuthToken();
      res.status(201).json({
        user,
        token
      });
    } catch (e) {
      res.status(500).json({
        msg: "server error",
        error: e.message
      });
    }
  },
  (err, req, res) => {
    res.status(400).send({ err: err.message });
  }
);

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const pwd = req.body.password;
  try {
    const user = await User.findByCredentials(email, pwd);
    const token = await user.generateAuthToken();
    res.status(200).send({
      user,
      token
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token != req.token);
    await req.user.save();

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/logoutAll", auth, (req, res) => {
  try {
    req.user.tokens = [];
    req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error("no such an image");
    }

    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

router.get("/me", auth, (req, res) => {
  res.status(200).send(req.user);
});

router.patch("/me", auth, async (req, res) => {
  const permittedUpdates = ["nickName", "email", "profileImg"];
  try {
    for (let up in req.body) {
      if (permittedUpdates.includes(up)) {
        req.user[up] = req.body[up];
      } else {
        throw new Error("updaten not permited");
      }
    }
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
});

router.delete("/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
