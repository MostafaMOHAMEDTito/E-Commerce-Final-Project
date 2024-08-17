import { model, Schema, Types } from "mongoose";

const wishlistSchema = new Schema(
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
    totalPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Wishlist = model("Wishlist", wishlistSchema);
export default Wishlist;
