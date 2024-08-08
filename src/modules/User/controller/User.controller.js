import User from "../../../../database/models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import sendEmail from "../../../utils/sendEmail.js";
import asyncHandler from "../../../middleware/asyncHandler.js";

//1-  Sign Up
export const signUp = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the email already exists
  const existEmail = await User.findOne({ email });
  if (existEmail) {
    return res.status(409).json({ message: "Email already exists" });
  }

  // Hash the password
  const hashPassword = bcryptjs.hashSync(password, 8);
  req.body.password = hashPassword;

  const newUser = await User.create(req.body);
  newUser.password = undefined;

  return res
    .status(201)
    .json({ message: "User created successfully", user: newUser });
});
//2 - Sign In
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !bcryptjs.compareSync(password, user.password)) {
    return next(new Error("invalid email or password", { cause: 401 }));
    //return res.status(401).json({ message: "Email or Password not found" });
  }
  // Update user status to online
  const updateStatus = await User.findByIdAndUpdate(
    user.id,
    { status: "online" },
    { new: true }
  );
  // Generate JWT token
  jwt.sign(
    {
      _id: user.id,
      name: user.username,
      email: user.email,
      mobileNumber: user.mobileNumber,
      status: updateStatus.status,
      role: user.role,
    },
    "mostafa",
    (error, token) => {
      if (error) {
        console.error("Error generating token", error.message);
        return res
          .status(500)
          .json({ message: "Error generating token", Error: error.message });
      }
      return res.status(200).json({ message: "Login successful", token });
    }
  );
});
//3 - update account.
export const updateAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  // Check if user is online
  const onlineStatus = req.user.status;
  if (onlineStatus != "online") {
    res
      .status(402)
      .json({ message: "You must be online to update your account" });
  }
  // Check if email, password, or mobile number already exists
  const { email, mobileNumber } = req.body;
  const existingUser = await User.findOne({
    $or: [{ email }, { mobileNumber }],
  });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "Email or mobile number already exists" });
  }
  // Update user account details
  const updateData = { ...req.body };
  if (updateData.firstName && updateData.lastName) {
    updateData.username = `${updateData.firstName} ${updateData.lastName}`;
  }

  // Update user account details
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  return res
    .status(200)
    .json({ message: "Updated successfully", user: updatedUser });
});
//4 - Delete account
export const deletedAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  // Check if user is online
  const onlineStatus = req.user.status;
  if (onlineStatus !== "online") {
    res
      .status(402)
      .json({ message: "You must be online to update your account" });
  }
  // Deleted user
  const deletedUser = await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json({ message: "Deleted successfully", user: deletedUser });
});
//5 - Get user account data
export const getUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  // Check if user is online
  const onlineStatus = req.user.status;
  if (onlineStatus !== "online") {
    res
      .status(402)
      .json({ message: "You must be online to update your account" });
  }
  const user = await User.findById(userId);
  return res.status(200).json({ message: "successfully", user: user });
});
//6 - Get profile data for another user
export const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ message: "successfully", user: user });
});
//7 - Update password
export const updatePassword = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  // Check if user is online
  const onlineStatus = req.user.status;
  if (onlineStatus !== "online") {
    res
      .status(402)
      .json({ message: "You must be online to update your password" });
  }

  const { password } = req.body;
  const newPassword = bcryptjs.hashSync(password, 8);

  // Update user account details
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { password: newPassword },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json({ message: "Updated successfully", user: updatedUser });
});
//8 - Forget password (make sure of your data security specially the OTP and the newPassword )
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const otp = customAlphabet("0123456789", 4)();
  user.resetPasswordOTP = otp;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  //send Email
  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    html: `<h1>Your verification code: ${otp}</h1>`,
  });
  res.status(200).json({ message: "OTP sent to your email" });
});
export const newPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid OTP or OTP has expired" });
  }
  const hashPassword = bcryptjs.hashSync(newPassword, 8);
  user.password = hashPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  const userNewPass = await User.findOneAndUpdate({ email }, user, {
    new: true,
  });
  res
    .status(200)
    .json({ message: "Password reset successfully", user: userNewPass });
});
//9 - Get all accounts associated to a specific recovery Email
export const getUserByEmail = asyncHandler(async (req, res, next) => {
  const { recoveryEmail } = req.body;

  const users = await User.find({ recoveryEmail });
  if (!users || users.length == 0) {
    return res
      .status(404)
      .json({ message: "No users found with this recovery email" });
  }
  return res.status(200).json({ message: "successfully", users });
});
