import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = Schema({
  googleId: {
    type: String,
    default: "",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [
      function () {
        return this.googleId === null || this.googleId.trim().length === 0;
      },
    ],
  },
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  registeredOn: {
    type: Date,
    default: Date.now(),
  },
});

// Use pre middleware to hash the password before saving the model
userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  try {
    // Generate a salt and hash the password using bcrypt
    const rounds = 12;
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Replace the plaintext password with the hashed password
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

export const UserModel = model("User", userSchema);
