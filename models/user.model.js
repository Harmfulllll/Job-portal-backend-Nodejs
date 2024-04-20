import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.generateJWT = function () {
  const payload = {
    id: this._id,
    name: this.name,
    email: this.email,
  };

  const secretKey = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" }; // Token expires in 1 hour

  return jwt.sign(payload, secretKey, options);
};

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
