import { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Minimum length is 3 characters"],
      maxlength: [150, "Maximum length is 150 characters"],
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Minimum length is 3 characters"],
      maxlength: [150, "Maximum length is 150 characters"],
      lowercase: true,
    },
    desc: {
      type: String,
      required: true,
    },
    mainImage: String,
    coverImage: [String],
    price: {
      type: Number,
      required: true,
      min: [0, "Minimum price is 0"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [0, "Minimum price after discount is 0"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Minimum stock is 0"],
      default: 0,
    },
    sold: {
      type: Number,
      min: [0, "Minimum sold is 0"],
      default: 0,
    },
    rateAverage: {
      type: Number,
      min: [0, "Minimum rate average is 0"],
      required: false,
    },
    rateCount: {
      type: Number,
      min: [0, "Minimum rate count is 0"],
      required: false,
    },
    createdBy: {
      type: Types.ObjectId,
      // required: true,
      // ref: "User",
    },
    updatedBy: {
      type: Types.ObjectId,
      // ref: "User",
    },
    category: {
      type: Types.ObjectId,
      required: true,
      ref: "Category",
    },
    subCategory: {
      type: Types.ObjectId,
      required: true,
      ref: "SubCategory",
    },
    brand: {
      type: Types.ObjectId,
      required: true,
      ref: "Brand",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
productSchema.post("init", (doc) => {
  if (doc?.mainImage) {
    doc.mainImage = "http://localhost:3000/uploads/product/" + doc?.mainImage;
  }
});
productSchema.post("init", (doc) => {
  if (doc?.coverImage) {
    doc.coverImage =  doc?.coverImage.map(
      (image) => "http://localhost:3000/uploads/product/" + image
    );
  }
});
const Product = model("Product", productSchema);

export default Product;
