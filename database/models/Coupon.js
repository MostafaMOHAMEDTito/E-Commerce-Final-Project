import mongoose, { model } from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    expire: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Coupon = model("Coupon", couponSchema);

export default Coupon;
