
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  recoveryEmail: {
    type: String,
    required : true ,
    trim: true,
    lowercase: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    length: 11
  },
  role: {
    type: String,
    enum: ['User', 'Company_HR'],
    default: 'User',
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
}, {
  timestamps: { updatedAt: false },
  versionKey: false,
});

// Middleware to create username based on firstName and lastName
userSchema.pre('validate', function (next) {
  if (!this.username) {
    this.username = `${this.firstName} ${this.lastName}`.toLowerCase();
  }
  next();
});


const User = mongoose.model('User', userSchema);

export default User;
