import { model, Schema, Types } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      unique: true,
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
    discount: {
      type: Number,

      default: 0,
    },
    subTotal: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Cart = model("Cart", cartSchema);
export default Cart;
