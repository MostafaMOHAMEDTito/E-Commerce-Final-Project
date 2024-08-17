import mongoose from "mongoose";
import roles from "../../src/Types/roles.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "min length is 2 character"],
      max: [15, "max length is 15 character"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email is unique"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.user,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    resetPasswordOTP: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: { updatedAt: false },
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
