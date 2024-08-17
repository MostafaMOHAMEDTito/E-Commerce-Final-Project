import { model, Schema, Types } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          min: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    deliveredAt: Date,
    PaymentMethod: {
      type: String,
      enum: ["cash", "Card"],
      default: "cash",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = model("Order", orderSchema);
export default Order;
