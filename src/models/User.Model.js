import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const VALID_ROLES = ["admin", "superAdmin", "user"];

const userSchema = new Schema({
  avatar: {
    ref: "Image",
    type: Schema.Types.ObjectId,
  },
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
  roles: {
    type: [
      {
        type: String,
        enum: VALID_ROLES,
      },
    ],
    default: ["user"],
    validate: {
      validator: function (roles) {
        // check if the array has more than 3 elements
        if (roles.length > 3) {
          return false;
        }
        // check if all roles are valid
        const invalidRoles = roles.filter(
          (role) => !VALID_ROLES.includes(role)
        );
        if (invalidRoles.length > 0) {
          return false;
        }
        // check if there are no duplicates
        const uniqueRoles = [...new Set(roles)];
        if (uniqueRoles.length !== roles.length) {
          return false;
        }
        return true;
      },
      message: (props) => `${props.value} is not a valid set of roles.`,
    },
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
    const salt = await bcrypt.genSalt(rounds);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Replace the plaintext password with the hashed password
    user.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};


export const UserModel = model("User", userSchema);
