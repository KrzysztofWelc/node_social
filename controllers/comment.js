const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const Comment = require("../db/models/Comment");

router.post("/add", (req, res) => {
  console.log("comment");
});

module.exports = router;
