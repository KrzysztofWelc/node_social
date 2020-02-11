const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  profileImg: {
    type: String,
    default: "default.jpg"
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.statics.findByCredentials = async (email, pwd) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("unable to login");
  }

  const passwordMatch = await bcrypt.compare(pwd, user.passwordHash);
  if (!passwordMatch) {
    throw new Error("wrong password");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "secret");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function() {
  const user = this;

  const userObject = user.toObject();

  delete userObject.passwordHash;
  delete userObject.tokens;

  return userObject;
};

userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("passwordHash")) {
    user.passwordHash = await bcrypt.hash(user.passwordHash, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
