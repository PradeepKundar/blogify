const { createHmac, randomBytes } = require("crypto");

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User Not Found");

  const salt = user.salt;
  const userPassword = user.password;

  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  //   console.log(hashedPassword);
  if (hashedPassword !== userPassword) throw new Error("Password Incorrect");
  return user;
});

const User = model("user", userSchema);

module.exports = User;
