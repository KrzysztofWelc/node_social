const router = require("express").Router();
const User = require("../db/models/User");
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const { email, nickName, password } = req.body;

  const newUser = new User({ email, nickName, passwordHash: password });
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
});

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
