import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },

    // نقش کاربر
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // وضعیت فعال بودن
    isActive: {
      type: Boolean,
      default: true,
    },

    // برای بازیابی رمز عبور
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);