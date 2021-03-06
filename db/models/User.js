const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sharp = require('sharp');
const jwt = require("jsonwebtoken");
const Post = require("./Post");
const Like = require("./Like");


const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  nickName: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  //200x200
  avatar: {
    type: Buffer
  },
  //50x50
  smallAvatar: {
    type: Buffer
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.virtual("follows", {
  ref: "Follow",
  localField: "_id",
  foreignField: "ownerId"
});

userSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "owner"
});

userSchema.statics.findByCredentials = async (email, pwd) => {
  const user = await User.findOne({
    email
  });
  if (!user) {
    throw new Error("unable to login");
  }

  const passwordMatch = await bcrypt.compare(pwd, user.passwordHash);
  if (!passwordMatch) {
    throw new Error("wrong password");
  }

  return user;
};

userSchema.methods.setAvatar = async function (buffer) {
  const user = this;
  const avatar = await sharp(buffer).resize({
    width: 250,
    height: 250
  }).png().toBuffer();

  const smallAvatar = await sharp(buffer).resize({
    width: 50,
    height: 50
  }).png().toBuffer();

  user.avatar = avatar;
  user.smallAvatar = smallAvatar;
}

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({
    _id: user._id.toString()
  }, "secret");

  user.tokens = user.tokens.concat({
    token
  });
  await user.save();

  return token;
};
userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.passwordHash;
  delete userObject.tokens;
  delete userObject.avatar;
  delete userObject.smallAvatar;

  return userObject;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("passwordHash")) {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 8);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Post.deleteMany({
    owner: user._id
  });
  await Like.deleteMany({
    owner: user._id
  });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;